class PromptManager {
  constructor() {
    this.currentEditId = null;
    this.currentFilter = '';
    this.currentSearchFilter = '';
    this.allTags = [];
    this.activeAutocompleteIndex = -1;
    this.init();
  }

  async init() {
    applyI18nToDOM();
    await this.initTheme();
    this.bindEvents();
    await this.loadPrompts();
    await this.loadTags();
    this.allTags = await promptStorage.getAllTags();

    // Auto-focus search input when popup opens
    setTimeout(() => {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  }

  bindEvents() {
    const elements = {
      'new-prompt-btn': () => this.showForm(),
      'cancel-btn': () => this.hideForm(),
      'prompt-form-element': (e) => this.handleSubmit(e),
      'tag-filter': (e) => this.filterPrompts(e.target.value),
      'search-input': (e) => this.searchPrompts(e.target.value),
      'export-btn': () => this.exportPrompts(),
      'import-btn': () => this.toggleImportMode(),
      'browse-btn': () => this.importPrompts(),
      'import-from-paste': () => this.importFromPaste(),
      'backups-btn': () => this.toggleBackupPanel(),
      'theme-toggle': () => this.cycleTheme(),
    };

    for (const [id, handler] of Object.entries(elements)) {
      const element = document.getElementById(id);

      if (!element) {
        continue;
      }

      if (id === 'prompt-form-element') {
        element.addEventListener('submit', handler);
      } else if (id === 'tag-filter') {
        element.addEventListener('change', handler);
      } else if (id === 'search-input') {
        element.addEventListener('input', handler);
      } else {
        element.addEventListener('click', handler);
      }

    }

    // Setup tag autocomplete events
    const tagsInput = document.getElementById('prompt-tags');
    if (tagsInput) {
      tagsInput.addEventListener('input', () => this.handleTagInput());
      tagsInput.addEventListener('keydown', (e) => this.handleTagKeydown(e));
      tagsInput.addEventListener('focus', () => this.handleTagInput());
      tagsInput.addEventListener('blur', () => {
        setTimeout(() => this.hideTagSuggestions(), 150);
      });
    }

    const suggestionsEl = document.getElementById('tag-suggestions');
    if (suggestionsEl) {
      suggestionsEl.addEventListener('mousedown', (e) => {
        const item = e.target.closest('.tag-suggestion-item');
        if (item) {
          e.preventDefault();
          this.selectTagSuggestion(item.dataset.tag);
        }
      });
    }

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      const wrapper = document.querySelector('.tag-input-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        this.hideTagSuggestions();
      }
    });

    // Setup drag and drop for import
    this.setupDragAndDrop();

    // Setup paste textarea input listener
    this.setupPasteTextarea();
  }

  setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const fakeEvent = {
          target: { files: files }
        };
        this.handleImportFile(fakeEvent);
      }
    });
  }

  setupPasteTextarea() {
    const textarea = document.getElementById('paste-json');
    if (!textarea) return;

    textarea.addEventListener('input', () => {
      this.updateImportButtonState();
    });

    textarea.addEventListener('paste', () => {
      // Small delay to let the paste content be processed
      setTimeout(() => {
        this.updateImportButtonState();
      }, 10);
    });
  }

  async initTheme() {
    const { theme } = await browser.storage.local.get('theme');
    this.applyTheme(theme || 'auto');
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    const html = document.documentElement;
    const btn = document.getElementById('theme-toggle');

    if (theme === 'auto') {
      html.removeAttribute('data-theme');
      if (btn) btn.textContent = '🖥️';
    } else if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
      if (btn) btn.textContent = '☀️';
    } else {
      html.setAttribute('data-theme', 'dark');
      if (btn) btn.textContent = '🌙';
    }
  }

  async cycleTheme() {
    const order = ['auto', 'light', 'dark'];
    const next = order[(order.indexOf(this.currentTheme) + 1) % order.length];
    this.applyTheme(next);
    await browser.storage.local.set({ theme: next });
  }

  toggleImportMode() {
    const dropZone = document.getElementById('drop-zone');
    const promptList = document.getElementById('prompt-list');

    if (dropZone.classList.contains('hidden')) {
      // Show drop zone
      dropZone.classList.remove('hidden');
      promptList.style.display = 'none';
      document.getElementById('import-btn').textContent = t('btn.cancel');
      // Clear previous paste content
      const textarea = document.getElementById('paste-json');
      textarea.value = '';
      this.updateImportButtonState();
      this.highlightRecommendedMethod();

      // Auto-focus textarea for Firefox users (recommended method)
      const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
      if (isFirefox) {
        setTimeout(() => {
          textarea.focus();
        }, 100);
      }
    } else {
      // Hide drop zone  
      dropZone.classList.add('hidden');
      promptList.style.display = '';  // Reset to use CSS default (grid)
      document.getElementById('import-btn').textContent = t('btn.import');
    }
  }

  highlightRecommendedMethod() {
    const methods = document.querySelectorAll('.import-method');

    // Firefox only - highlight paste method
    methods[2]?.classList.add('recommended');
    methods[2]?.setAttribute('data-recommended-label', t('import.recommended'));
    methods[0]?.classList.remove('recommended');
  }


  async importFromPaste() {
    const textarea = document.getElementById('paste-json');
    const jsonText = textarea.value.trim();

    if (!jsonText) {
      this.showNotification(t('notify.pasteFirst'), 'warning');
      return;
    }

    // Create a fake event object to reuse existing import logic
    const fakeEvent = {
      target: {
        files: [{
          text: () => Promise.resolve(jsonText),
          name: 'pasted-content.json'
        }]
      }
    };

    await this.handleImportFile(fakeEvent);
  }

  updateImportButtonState() {
    const textarea = document.getElementById('paste-json');
    const importBtn = document.getElementById('import-from-paste');

    if (textarea && importBtn) {
      importBtn.disabled = !textarea.value.trim();
    }
  }

  async showForm(promptId = null) {
    // Refresh autocomplete tag cache
    this.allTags = await promptStorage.getAllTags();

    this.currentEditId = promptId;
    const form = document.getElementById('prompt-form');
    const title = document.getElementById('form-title');
    const titleInput = document.getElementById('prompt-title');
    const contentInput = document.getElementById('prompt-content');
    const tagsInput = document.getElementById('prompt-tags');

    if (promptId) {
      title.textContent = t('form.editPrompt');
      this.loadPromptForEdit(promptId);
    } else {
      title.textContent = t('form.newPrompt');
      titleInput.value = '';
      contentInput.value = '';
      tagsInput.value = '';
    }

    form.classList.remove('hidden');
    titleInput.focus();
  }

  hideForm() {
    document.getElementById('prompt-form').classList.add('hidden');
    this.currentEditId = null;
  }

  async loadPromptForEdit(promptId) {
    try {
      const prompt = await promptStorage.getPromptById(promptId);
      if (prompt) {
        document.getElementById('prompt-title').value = prompt.label || '';
        document.getElementById('prompt-content').value = prompt.template || '';
        document.getElementById('prompt-tags').value = prompt.tags ? prompt.tags.join(', ') : '';
      }
    } catch (error) {
      console.error('Error loading prompt for edit:', error);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('prompt-title').value.trim();
    const content = document.getElementById('prompt-content').value.trim();
    const tagsInput = document.getElementById('prompt-tags').value.trim();

    if (!title || !content) {
      alert(t('alert.titleContentRequired'));
      return;
    }

    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const prompt = {
      id: this.currentEditId,
      label: title,
      template: content,
      tags: tags
    };

    try {
      await promptStorage.savePrompt(prompt);
      this.hideForm();
      await this.loadPrompts();
      await this.loadTags();
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert(t('alert.saveError'));
    }
  }

  async loadPrompts() {
    try {
      const prompts = await promptStorage.getPrompts();
      this.renderPrompts(prompts);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  }

  async loadTags() {
    try {
      const tags = await promptStorage.getAllTags();
      const select = document.getElementById('tag-filter');
      const currentValue = select.value;

      select.textContent = '';
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = t('filter.allTags');
      select.appendChild(defaultOpt);

      tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        if (tag === currentValue) option.selected = true;
        select.appendChild(option);
      });

      // Update autocomplete cache
      this.allTags = tags;
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }

  renderPrompts(prompts) {
    const container = document.getElementById('prompt-list');
    const emptyState = document.getElementById('empty-state');

    if (prompts.length === 0) {
      container.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');

    let filteredPrompts = prompts;

    // Apply search filter first (primary filter)
    if (this.currentSearchFilter) {
      filteredPrompts = filteredPrompts.filter(prompt =>
        prompt.label.toLowerCase().includes(this.currentSearchFilter)
      );
    }

    // Apply tag filter second (secondary filter)
    if (this.currentFilter) {
      filteredPrompts = filteredPrompts.filter(prompt =>
        prompt.tags && prompt.tags.includes(this.currentFilter)
      );
    }

    if (filteredPrompts.length === 0) {
      container.innerHTML = '';
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = t('filter.noResults');
      container.appendChild(noResults);
      return;
    }

    // Clear container and add prompts safely
    container.innerHTML = '';
    filteredPrompts.forEach(prompt => {
      const element = this.createPromptElementDOM(prompt);
      container.appendChild(element);
    });
  }

  createPromptElementDOM(prompt) {
    // Create main container
    const promptItem = document.createElement('div');
    promptItem.className = 'prompt-item';
    promptItem.dataset.id = prompt.id;

    // Create header
    const header = document.createElement('div');
    header.className = 'prompt-header';

    const title = document.createElement('h3');
    title.className = 'prompt-title';
    title.textContent = prompt.label;

    const star = document.createElement('span');
    star.className = prompt.favorite ? 'favorite-star favorited' : 'favorite-star';
    star.dataset.id = prompt.id;
    star.setAttribute('role', 'button');
    star.setAttribute('tabindex', '0');
    star.setAttribute('aria-label', prompt.favorite ? t('aria.removeFavorite', prompt.label) : t('aria.addFavorite', prompt.label));
    star.textContent = prompt.favorite ? '★' : '☆';

    header.appendChild(title);
    header.appendChild(star);

    // Create tags container
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'prompt-tags';
    if (prompt.tags && prompt.tags.length > 0) {
      prompt.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.dataset.tag = tag;
        tagSpan.setAttribute('role', 'button');
        tagSpan.setAttribute('tabindex', '0');
        tagSpan.setAttribute('aria-label', t('aria.filterByTagValue', tag));
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
      });
    }

    // Create actions container
    const actions = document.createElement('div');
    actions.className = 'prompt-actions';

    const buttons = [
      { class: 'insert-btn btn btn--success btn--sm', text: t('btn.insert'), ariaLabel: t('aria.insertPrompt', prompt.label) },
      { class: 'copy-btn btn btn--primary btn--sm', text: t('btn.copy'), ariaLabel: t('aria.copyPrompt', prompt.label) },
      { class: 'edit-btn btn btn--sm', text: t('btn.edit'), ariaLabel: t('aria.editPrompt', prompt.label) },
      { class: 'delete-btn btn btn--danger btn--sm', text: t('btn.delete'), ariaLabel: t('aria.deletePrompt', prompt.label) }
    ];

    buttons.forEach(btnConfig => {
      const button = document.createElement('button');
      button.className = btnConfig.class;
      button.dataset.id = prompt.id;
      button.textContent = btnConfig.text;
      button.setAttribute('aria-label', btnConfig.ariaLabel);
      actions.appendChild(button);
    });

    // Assemble the prompt item
    promptItem.appendChild(header);
    promptItem.appendChild(tagsContainer);
    promptItem.appendChild(actions);

    return promptItem;
  }

  async filterPrompts(tag) {
    this.currentFilter = tag;
    await this.loadPrompts();
  }

  async searchPrompts(searchTerm) {
    this.currentSearchFilter = searchTerm.toLowerCase().trim();
    await this.loadPrompts();
  }

  handleTagInput() {
    const input = document.getElementById('prompt-tags');
    const value = input.value;

    // Extract the current tag being typed (text after the last comma)
    const lastCommaIndex = value.lastIndexOf(',');
    const currentFragment = value.substring(lastCommaIndex + 1).trim().toLowerCase();

    // Get tags already entered in the input (everything before the current fragment)
    const enteredTags = value.substring(0, lastCommaIndex + 1)
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    if (!currentFragment) {
      this.hideTagSuggestions();
      return;
    }

    // Filter: match against allTags, exclude already-entered tags, case-insensitive
    const matches = this.allTags.filter(tag => {
      const tagLower = tag.toLowerCase();
      return tagLower.includes(currentFragment) && !enteredTags.includes(tagLower);
    });

    if (matches.length === 0) {
      this.hideTagSuggestions();
      return;
    }

    this.showTagSuggestions(matches, currentFragment);
  }

  showTagSuggestions(matches, fragment) {
    const container = document.getElementById('tag-suggestions');
    container.innerHTML = '';
    this.activeAutocompleteIndex = -1;

    matches.forEach(tag => {
      const item = document.createElement('div');
      item.className = 'tag-suggestion-item';
      item.dataset.tag = tag;
      item.setAttribute('role', 'option');

      // Highlight the matching portion
      const tagLower = tag.toLowerCase();
      const matchIndex = tagLower.indexOf(fragment);
      if (matchIndex !== -1) {
        const before = tag.substring(0, matchIndex);
        const match = tag.substring(matchIndex, matchIndex + fragment.length);
        const after = tag.substring(matchIndex + fragment.length);
        item.innerHTML = '';
        if (before) item.appendChild(document.createTextNode(before));
        const bold = document.createElement('span');
        bold.className = 'tag-match';
        bold.textContent = match;
        item.appendChild(bold);
        if (after) item.appendChild(document.createTextNode(after));
      } else {
        item.textContent = tag;
      }

      container.appendChild(item);
    });

    container.classList.remove('hidden');
  }

  hideTagSuggestions() {
    const container = document.getElementById('tag-suggestions');
    container.classList.add('hidden');
    container.innerHTML = '';
    this.activeAutocompleteIndex = -1;
  }

  selectTagSuggestion(tag) {
    const input = document.getElementById('prompt-tags');
    const value = input.value;
    const lastCommaIndex = value.lastIndexOf(',');

    // Build the new value: everything before the last comma + selected tag + ", "
    const prefix = lastCommaIndex !== -1
      ? value.substring(0, lastCommaIndex + 1) + ' '
      : '';

    input.value = prefix + tag + ', ';
    input.focus();
    this.hideTagSuggestions();
  }

  handleTagKeydown(e) {
    const container = document.getElementById('tag-suggestions');
    if (container.classList.contains('hidden')) return;

    const items = container.querySelectorAll('.tag-suggestion-item');
    if (items.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.activeAutocompleteIndex = Math.min(
          this.activeAutocompleteIndex + 1,
          items.length - 1
        );
        this.updateAutocompleteHighlight(items);
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.activeAutocompleteIndex = Math.max(
          this.activeAutocompleteIndex - 1,
          -1
        );
        this.updateAutocompleteHighlight(items);
        break;

      case 'Enter':
        if (this.activeAutocompleteIndex >= 0 && this.activeAutocompleteIndex < items.length) {
          e.preventDefault();
          const selectedTag = items[this.activeAutocompleteIndex].dataset.tag;
          this.selectTagSuggestion(selectedTag);
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.hideTagSuggestions();
        break;

      case 'Tab':
        if (this.activeAutocompleteIndex >= 0 && this.activeAutocompleteIndex < items.length) {
          e.preventDefault();
          const selectedTag = items[this.activeAutocompleteIndex].dataset.tag;
          this.selectTagSuggestion(selectedTag);
        } else {
          this.hideTagSuggestions();
        }
        break;
    }
  }

  updateAutocompleteHighlight(items) {
    items.forEach((item, index) => {
      if (index === this.activeAutocompleteIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  async exportPrompts() {
    try {
      const jsonData = await promptStorage.exportPrompts();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `prompts-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting prompts:', error);
      alert(t('alert.exportError'));
    }
  }

  async importPrompts() {
    try {
      // Try modern File System Access API first
      if ('showOpenFilePicker' in window) {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [{
            description: 'JSON files',
            accept: {
              'application/json': ['.json']
            }
          }]
        });

        const file = await fileHandle.getFile();

        // Create a fake event object to maintain compatibility
        const fakeEvent = {
          target: {
            files: [file]
          }
        };

        await this.handleImportFile(fakeEvent);
        return;
      }
    } catch (error) {
      // Fall through to traditional method
    }

    // Fallback to traditional input file method
    const importFile = document.getElementById('import-file');

    if (!importFile) {
      this.showNotification(t('notify.importElementError'), 'error');
      return;
    }

    // Reset the input value to ensure change event fires even for same file
    importFile.value = '';

    // Add a temporary event listener for this specific import
    const handleFileSelect = async (e) => {
      importFile.removeEventListener('change', handleFileSelect);
      await this.handleImportFile(e);
    };

    importFile.addEventListener('change', handleFileSelect);

    importFile.click();
  }

  async handleImportFile(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    try {
      // Check file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        this.showNotification(t('notify.selectJson'), 'warning');
        e.target.value = '';
        return;
      }

      const text = await file.text();

      // Create backup before importing
      await promptStorage.createBackup('pre-import');

      const result = await promptStorage.importPrompts(text);

      if (result.imported === 0) {
        this.showNotification(t('notify.noNewImported'), 'info');
      } else if (result.imported === result.total) {
        this.showNotification(t('notify.importedAll', result.imported));
      } else {
        this.showNotification(t('notify.importedPartial', result.imported, result.total));
      }

      await this.loadPrompts();
      await this.loadTags();

      // Close import mode if it's open
      const dropZone = document.getElementById('drop-zone');
      if (dropZone && !dropZone.classList.contains('hidden')) {
        this.toggleImportMode();
      }
    } catch (error) {
      console.error('Error importing prompts:', error);
      this.showNotification(t('notify.importError', error.message), 'error');
    }

    e.target.value = '';
  }

  async insertPrompt(promptId) {
    try {
      const prompt = await promptStorage.getPromptById(promptId);
      if (!prompt) {
        return;
      }

      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) {
        alert(t('alert.noActiveTab'));
        return;
      }

      const tabId = tabs[0].id;

      try {
        // Step 1: Deposit text and locale in globals before content.js runs
        await browser.scripting.executeScript({
          target: { tabId },
          func: (text, locale) => {
            window._aiPromptPending = text;
            window._aiPromptLocale = locale;
          },
          args: [prompt.template, I18N_LOCALE]
        });

        // Step 2: Load content.js which processes _aiPromptPending
        await browser.scripting.executeScript({
          target: { tabId },
          files: ['content.js']
        });

        window.close();
      } catch (error) {
        // Page restreinte (about:, moz-extension:, etc.)
        console.error('Script execution failed:', error);
        await this.copyToClipboard(prompt.template);
        this.showNotification(t('notify.cannotInject'), 'warning');
      }
    } catch (error) {
      console.error('Error inserting prompt:', error);
    }
  }

  async toggleBackupPanel() {
    const panel = document.getElementById('backup-panel');
    const promptList = document.getElementById('prompt-list');
    const filterSection = document.querySelector('.filter-section');

    if (panel.classList.contains('hidden')) {
      // Close import mode if open
      const dropZone = document.getElementById('drop-zone');
      if (dropZone && !dropZone.classList.contains('hidden')) {
        this.toggleImportMode();
      }

      // Close form if open
      this.hideForm();

      panel.classList.remove('hidden');
      promptList.style.display = 'none';
      filterSection.style.display = 'none';
      document.getElementById('backups-btn').textContent = t('btn.cancel');
      await this.loadBackups();
    } else {
      panel.classList.add('hidden');
      promptList.style.display = '';
      filterSection.style.display = '';
      document.getElementById('backups-btn').textContent = t('btn.backups');
    }
  }

  async loadBackups() {
    const backups = await promptStorage.getBackups();
    const listEl = document.getElementById('backup-list');
    const emptyEl = document.getElementById('backup-empty');

    listEl.innerHTML = '';

    if (backups.length === 0) {
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');

    const reasonLabels = {
      'startup': t('backup.reason.startup'),
      'update': t('backup.reason.update'),
      'pre-import': t('backup.reason.preImport'),
      'pre-restore': t('backup.reason.preRestore'),
      'manual': t('backup.reason.manual')
    };

    backups.forEach(backup => {
      const item = document.createElement('div');
      item.className = 'backup-item';

      const info = document.createElement('div');
      info.className = 'backup-item-info';

      const dateEl = document.createElement('div');
      dateEl.className = 'backup-item-date';
      dateEl.textContent = new Date(backup.timestamp).toLocaleString();

      const metaEl = document.createElement('div');
      metaEl.className = 'backup-item-meta';
      metaEl.textContent = `${backup.promptCount} prompts — ${reasonLabels[backup.reason] || backup.reason}`;

      info.appendChild(dateEl);
      info.appendChild(metaEl);

      const restoreBtn = document.createElement('button');
      restoreBtn.textContent = t('btn.restore');
      restoreBtn.addEventListener('click', () => this.restoreBackup(backup.id));

      item.appendChild(info);
      item.appendChild(restoreBtn);
      listEl.appendChild(item);
    });
  }

  async restoreBackup(backupId) {
    if (!confirm(t('confirm.restore'))) return;

    try {
      const result = await promptStorage.restoreBackup(backupId);
      this.showNotification(t('notify.restored', result.restored));
      await this.loadPrompts();
      await this.loadTags();
      await this.loadBackups();
    } catch (error) {
      console.error('Error restoring backup:', error);
      this.showNotification(t('notify.restoreError'), 'error');
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    // Remove previous type classes
    notification.classList.remove('notification--error', 'notification--warning', 'notification--info');
    if (type !== 'success') {
      notification.classList.add(`notification--${type}`);
    }

    notificationText.textContent = message;
    notification.classList.remove('hidden');

    const duration = type === 'warning' ? 6000 : 4000;
    setTimeout(() => {
      notification.classList.add('hidden');
    }, duration);
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Clipboard write failed:', error);
    }
  }


  async copyPromptToClipboard(promptId) {
    try {
      const prompt = await promptStorage.getPromptById(promptId);
      if (!prompt) {
        return;
      }

      await this.copyToClipboard(prompt.template);
      this.showNotification(t('notify.copied'));
    } catch (error) {
      console.error('Error copying prompt to clipboard:', error);
      this.showNotification(t('notify.copyError'), 'error');
    }
  }

  async deletePrompt(promptId) {
    if (!confirm(t('confirm.delete'))) return;

    try {
      await promptStorage.deletePrompt(promptId);
      await this.loadPrompts();
      await this.loadTags();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert(t('alert.deleteError'));
    }
  }

  async toggleFavorite(promptId) {
    try {
      // Get prompt info before toggling for better notification
      const prompt = await promptStorage.getPromptById(promptId);
      const wasInitiallyFavorite = prompt.favorite;

      const newFavoriteStatus = await promptStorage.toggleFavorite(promptId);

      // Reload prompts to reflect the new sorting order
      await this.loadPrompts();

      // Show a more informative notification
      let message;
      if (newFavoriteStatus) {
        message = '★ ' + t('notify.addedFavorite');
      } else {
        message = '☆ ' + t('notify.removedFavorite');
      }
      this.showNotification(message);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      this.showNotification(t('notify.favoriteError'), 'error');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const manager = new PromptManager();

  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('insert-btn')) {
      const promptId = e.target.dataset.id;
      await manager.insertPrompt(promptId);
    } else if (e.target.classList.contains('copy-btn')) {
      const promptId = e.target.dataset.id;
      await manager.copyPromptToClipboard(promptId);
    } else if (e.target.classList.contains('edit-btn')) {
      const promptId = e.target.dataset.id;
      manager.showForm(promptId);
    } else if (e.target.classList.contains('delete-btn')) {
      const promptId = e.target.dataset.id;
      await manager.deletePrompt(promptId);
    } else if (e.target.classList.contains('favorite-star')) {
      e.stopPropagation(); // Prevent triggering prompt insertion
      const promptId = e.target.dataset.id;
      await manager.toggleFavorite(promptId);
    } else if (e.target.classList.contains('tag')) {
      const tag = e.target.dataset.tag;
      document.getElementById('tag-filter').value = tag;
      await manager.filterPrompts(tag);
    } else if (e.target.classList.contains('prompt-item') || e.target.closest('.prompt-item')) {
      // Ignore clicks on buttons, tags, and stars - they have their own handlers
      if (e.target.closest('.prompt-actions') ||
        e.target.classList.contains('tag') ||
        e.target.classList.contains('favorite-star')) {
        return;
      }

      const promptItem = e.target.classList.contains('prompt-item')
        ? e.target
        : e.target.closest('.prompt-item');
      const promptId = promptItem.dataset.id;
      await manager.insertPrompt(promptId);
    }
  });

  // Keyboard support for interactive non-button elements (stars, tags)
  document.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    if (e.target.classList.contains('favorite-star')) {
      e.preventDefault();
      e.stopPropagation();
      const promptId = e.target.dataset.id;
      await manager.toggleFavorite(promptId);
    } else if (e.target.classList.contains('tag')) {
      e.preventDefault();
      const tag = e.target.dataset.tag;
      document.getElementById('tag-filter').value = tag;
      await manager.filterPrompts(tag);
    }
  });
});