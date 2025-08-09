class PromptStorage {
  constructor() {
    this.storageKey = 'prompts';
    this.selectorsKey = 'selectors';
  }

  generateId() {
    return 'prompt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async getPrompts() {
  try {
    const result = await browser.storage.local.get(this.storageKey);
    const raw = result[this.storageKey];
    let prompts = [];
    
    if (Array.isArray(raw)) {
      prompts = raw;
    } else if (raw && typeof raw === 'object' && Array.isArray(raw.prompts)) {
      prompts = raw.prompts;
      await browser.storage.local.set({ [this.storageKey]: prompts });
    } else if (raw !== undefined) {
      await browser.storage.local.set({ [this.storageKey]: [] });
      return [];
    }
    
    // Ensure all prompts have favorite property (backward compatibility)
    prompts = prompts.map(prompt => ({
      ...prompt,
      favorite: prompt.favorite === true // Ensure it's a boolean, default to false
    }));
    
    // Sort favorites first
    prompts.sort((a, b) => {
      if (a.favorite === b.favorite) return 0;
      return a.favorite ? -1 : 1;
    });
    
    return prompts;
  } catch (error) {
    console.error('Error getting prompts:', error);
    return [];
  }
}

  async savePrompt(prompt) {
  try {
    let prompts = await this.getPrompts();
    if (!Array.isArray(prompts)) {
      prompts = Array.isArray(prompts?.prompts) ? prompts.prompts : [];
    }
    const label = (prompt.label || '').trim();
    const template = (prompt.template || '').trim();
    let tags = prompt.tags;
    if (!Array.isArray(tags)) {
      if (typeof tags === 'string') {
        tags = tags.split(',').map(t => t.trim()).filter(Boolean);
      } else {
        tags = [];
      }
    }
    const normalized = {
      id: prompt.id || this.generateId(),
      label,
      template,
      tags,
      favorite: prompt.favorite === true // Ensure it's a boolean, default to false
    };
    if (!prompt.id) {
      prompts.push(normalized);
    } else {
      const idx = prompts.findIndex(p => p.id === prompt.id);
      if (idx !== -1) prompts[idx] = normalized;
      else prompts.push(normalized);
    }
    await browser.storage.local.set({ [this.storageKey]: prompts });
    return normalized;
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }
}

  async deletePrompt(promptId) {
    try {
      const prompts = await this.getPrompts();
      const filteredPrompts = prompts.filter(p => p.id !== promptId);
      await browser.storage.local.set({ [this.storageKey]: filteredPrompts });
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
  }

  async getPromptById(promptId) {
    try {
      const prompts = await this.getPrompts();
      return prompts.find(p => p.id === promptId) || null;
    } catch (error) {
      console.error('Error getting prompt by ID:', error);
      return null;
    }
  }

  async toggleFavorite(promptId) {
    try {
      const prompts = await this.getPrompts();
      const promptIndex = prompts.findIndex(p => p.id === promptId);
      
      if (promptIndex === -1) {
        throw new Error('Prompt not found');
      }
      
      prompts[promptIndex].favorite = !prompts[promptIndex].favorite;
      await browser.storage.local.set({ [this.storageKey]: prompts });
      
      return prompts[promptIndex].favorite;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  async getAllTags() {
    try {
      const prompts = await this.getPrompts();
      const tags = new Set();
      
      prompts.forEach(prompt => {
        if (prompt.tags && Array.isArray(prompt.tags)) {
          prompt.tags.forEach(tag => tags.add(tag.trim()));
        }
      });
      
      return Array.from(tags).sort();
    } catch (error) {
      console.error('Error getting tags:', error);
      return [];
    }
  }

  async exportPrompts() {
    try {
      const prompts = await this.getPrompts();
      const data = {
        version: '1.0',
        exported: new Date().toISOString(),
        prompts: prompts
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting prompts:', error);
      throw error;
    }
  }

  async importPrompts(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    let promptsArray = null;
    if (data && Array.isArray(data.prompts)) promptsArray = data.prompts;
    else if (Array.isArray(data)) promptsArray = data;
    else if (data && typeof data === 'object' && Array.isArray(data.data)) promptsArray = data.data;
    else throw new Error('Invalid file format: expected {"prompts":[...]} or an array');

    const existingPrompts = await this.getPrompts();
    const existingTitles = new Set(existingPrompts.map(p => (p.label || '').toLowerCase().trim()));
    let imported = 0;

    const pick = (obj, keys) => {
      for (const k of keys) {
        if (obj && Object.prototype.hasOwnProperty.call(obj, k) && obj[k] != null) return obj[k];
      }
      return undefined;
    };
    const toTagsArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(t => String(t).trim()).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };

    for (const raw of promptsArray) {
      const label = pick(raw, ['label','title','name']);
      const template = pick(raw, ['template','content','text','prompt']);
      const tags = toTagsArray(pick(raw, ['tags','labels','categories']));

      const cleanLabel = (label || '').trim();
      const cleanTemplate = (template || '').trim();
      if (!cleanLabel || !cleanTemplate) continue;

      const key = cleanLabel.toLowerCase();
      if (existingTitles.has(key)) continue;

      const favoriteValue = pick(raw, ['favorite', 'starred', 'pinned']);
      existingPrompts.push({
        id: this.generateId(),
        label: cleanLabel,
        template: cleanTemplate,
        tags,
        favorite: favoriteValue === true || favoriteValue === 'true' || favoriteValue === 1
      });
      existingTitles.add(key);
      imported++;
    }

    await browser.storage.local.set({ [this.storageKey]: existingPrompts });
    return { imported, total: promptsArray.length };
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error('Invalid JSON file');
    throw error;
  }
}

  async getSelectors() {
    try {
      const result = await browser.storage.local.get(this.selectorsKey);
      return result[this.selectorsKey] || this.getDefaultSelectors();
    } catch (error) {
      console.error('Error getting selectors:', error);
      return this.getDefaultSelectors();
    }
  }

  getDefaultSelectors() {
    return {
      'chat.openai.com': '#prompt-textarea',
      'gemini.google.com': '[contenteditable="true"]',
      'claude.ai': '[contenteditable="true"]',
      'chat.mistral.ai': 'textarea',
      'grok.x.ai': 'textarea',
      'www.perplexity.ai': 'textarea',
      'chat.deepseek.com': 'textarea'
    };
  }

  async saveSelectors(selectors) {
    try {
      await browser.storage.local.set({ [this.selectorsKey]: selectors });
    } catch (error) {
      console.error('Error saving selectors:', error);
      throw error;
    }
  }
}

const promptStorage = new PromptStorage();