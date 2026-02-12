async function createAutoBackup(reason) {
  try {
    const result = await browser.storage.local.get(['prompts', 'backups']);
    const prompts = Array.isArray(result.prompts) ? result.prompts : [];
    if (prompts.length === 0) return;

    const backups = result.backups || [];

    // Anti-spam: skip if last backup is less than 1 hour old
    if (backups.length > 0) {
      const lastTimestamp = backups[0].timestamp;
      if (Date.now() - lastTimestamp < 3600000) return;
    }

    const backup = {
      id: 'backup_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      date: new Date().toISOString(),
      reason,
      promptCount: prompts.length,
      prompts
    };

    backups.unshift(backup);
    while (backups.length > 3) backups.pop();

    await browser.storage.local.set({ backups });
  } catch (error) {
    console.error('[ai_prompt_injector] Backup failed:', error);
  }
}

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') {
    createAutoBackup('update');
  }
});

browser.runtime.onStartup.addListener(() => {
  createAutoBackup('startup');
});
