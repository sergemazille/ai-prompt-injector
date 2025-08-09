# Prompt Library - Firefox Extension

A minimalist Firefox extension to manage and insert prompts into AI chat interfaces.

## Features

- **Prompt Management**: Create, edit, delete and organize your prompts
- **Tags**: Organize your prompts with tags and filter by tag
- **Universal Insertion**: Automatically insert into ChatGPT, Claude, Gemini, Mistral, Grok, Perplexity, DeepSeek and others
- **Import/Export**: Save and share your prompt collection in JSON format
- **Clipboard Fallback**: Automatic copy if DOM insertion fails

## Installation

### Manual Installation (Development)

1. Clone or download this project
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the left menu
4. Click "Load Temporary Add-on..."
5. Select the `manifest.json` file in the project folder
6. The extension appears in the Firefox toolbar

**Important**: After installation, refresh open web pages for the content script to load.

### Usage

1. Click the "Prompt Library" icon in the toolbar
2. Create your first prompts with "New Prompt"
3. Organize with tags (separated by commas)
4. On an AI chat page, click "Insert" to insert the prompt
5. Use the "Debug" button to diagnose insertion issues
6. Use Import/Export to save your collection

### Troubleshooting

If insertion doesn't work:

1. **Refresh the page**: The content script must be loaded
2. **Use the "Debug" button**: Check if an input field is detected
3. **Check permissions**: The extension requires authorization on all sites
4. **Check the console**: Open developer tools (F12) to see errors

## File Structure

```
├── manifest.json          # Extension configuration
├── popup.html             # User interface
├── popup.css              # Styles
├── popup.js               # Interface logic
├── storage.js             # Storage management
├── content.js             # Page injection script
├── browser-polyfill.js    # Firefox/Chrome API compatibility
├── background.js          # Background script
└── README.md              # Documentation
```

## Data Format

Prompts are stored in JSON format:

```json
{
  "id": "prompt_123456789_abc",
  "label": "Prompt title",
  "template": "Prompt content",
  "tags": ["tag1", "tag2"]
}
```

## Compatibility

- Firefox MV3
- Supported sites by default:
  - ChatGPT (chat.openai.com)
  - Claude (claude.ai)
  - Gemini (gemini.google.com)
  - Mistral (chat.mistral.ai)
  - Grok (grok.x.ai)
  - Perplexity (www.perplexity.ai)
  - DeepSeek (chat.deepseek.com)
  - And all other sites with textarea or contenteditable

## Permissions

- `activeTab`: Access to active tab for insertion
- `storage`: Local storage of prompts
- `scripting`: Script injection for DOM insertion
- `clipboardWrite`: Backup copy if insertion impossible

## Development

The extension uses the standard WebExtensions API, compatible with Firefox MV3. No external dependencies required.

To modify DOM selectors by site, edit the `getDefaultSelectors()` method in `storage.js`.