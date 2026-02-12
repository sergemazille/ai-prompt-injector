# AI Prompt Injector

Manage and insert prompts into any AI chat interface — Firefox extension.

![AI Prompt Injector](screenshots/light-theme.png)
![AI Prompt Injector - dark theme](screenshots/dark-theme.png)

## Installation

### Firefox Add-ons (recommended)

Install from [Firefox Add-ons (AMO)](https://addons.mozilla.org/en-US/firefox/addon/ai-prompt-injector/).

### Manual (development)

1. Clone or download this repository
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the left menu
4. Click "Load Temporary Add-on..."
5. Select the `manifest.json` file from the project folder

## Features

- **Prompt management** — create, edit, delete, and mark prompts as favorites
- **Tag system** — organize prompts with tags; autocomplete with keyboard navigation (arrows, Enter, Tab, Escape)
- **Real-time search** — filter prompts instantly by text or tag
- **Universal injection** — works on any website via on-demand script injection (`activeTab` + `scripting`)
  - 3-tier insertion: direct DOM → `execCommand('insertText')` → clipboard fallback (with warning)
- **Optimized selectors** for popular AI platforms: ChatGPT, Claude, Gemini, Mistral, DeepSeek, Grok, Qwen, Dust, NotebookLM, Google AI Studio — plus any site with a textarea or contenteditable field
- **Import/Export** — JSON format with flexible field mapping (accepts `label`/`title`/`name`, `template`/`content`/`text`, etc.)
- **Automatic backups** — on browser startup, extension update, and before each import (max 3, 1h anti-spam); restore from popup UI
- **i18n** — English and French
- **Theme toggle** — auto / light / dark
- **Accessibility** — `aria-label` on interactive elements, `aria-live` notifications, keyboard navigation
- **Privacy-first** — all data stored locally, zero tracking, no network requests

## Usage

1. Click the extension icon in the toolbar
2. Create prompts with "New Prompt" and organize them with tags
3. Navigate to any AI chat page
4. Click "Insert" on a prompt to inject it into the chat input

## Data format

Prompts are stored as JSON:

```json
{
  "id": "prompt_1234567890_abc123def",
  "label": "Prompt title",
  "template": "Prompt content",
  "tags": ["tag1", "tag2"],
  "favorite": false,
  "createdAt": 1234567890
}
```

The import system accepts various JSON structures and field names — see `storage.js` for the full mapping.

## Project structure

```
├── manifest.json          # Extension configuration (Manifest V3)
├── popup.html             # Popup UI
├── popup.css              # Styles with CSS custom properties and dark mode
├── popup.js               # PromptManager class — UI logic
├── storage.js             # PromptStorage class — CRUD, import/export, backups
├── content.js             # PromptInjector — DOM injection with domain selectors
├── background.js          # Auto-backup on startup and update
├── i18n.js                # Internationalization (en, fr)
├── icons/                 # Extension icons (16–128px)
├── screenshots/           # AMO listing screenshot
├── tests/                 # Unit tests (Vitest + happy-dom)
├── vitest.config.js       # Test configuration
├── build-firefox.sh       # Build script for AMO submission
├── CHANGELOG.md           # Version history
├── PRIVACY.md             # Privacy policy
├── TESTING.md             # Test documentation
└── LICENSE                # MIT
```

## Permissions

| Permission   | Purpose                                              |
|--------------|------------------------------------------------------|
| `activeTab`  | Access the current tab only when the user clicks Insert |
| `storage`    | Store prompts and settings locally                   |
| `scripting`  | Inject the content script on demand                  |

No `host_permissions`. No `content_scripts`. No remote code.

## Development

No external runtime dependencies. Dev dependencies are for testing only.

```bash
npm test              # Run tests in watch mode
npm run test:run      # Single test run
npm run test:coverage # Run with coverage report
```

To update DOM selectors for AI platforms, edit the `domainSelectors` object in `content.js`.

## Privacy

All data is stored locally in `browser.storage.local`. The extension makes no network requests and collects no data. See [PRIVACY.md](PRIVACY.md) for details.

## License

[MIT](LICENSE)
