# Changelog

## 1.2.0

### Changed
- Switch to on-demand injection via `scripting.executeScript` — works on any website, no more hardcoded site list
- 3-tier insertion strategy: direct DOM, then `execCommand('insertText')`, then clipboard as last resort
- Clipboard is no longer silently overwritten — clear warning notification when used as fallback

### Added
- Automatic backup system (on browser startup, extension update, and before each import)
- Backup restore UI in popup (Backups button)

### Removed
- `content_scripts` block from manifest (no longer needed)
- `host_permissions` site list (replaced by `activeTab`)
- Message-based communication (`browser.tabs.sendMessage` / `browser.runtime.onMessage`)
