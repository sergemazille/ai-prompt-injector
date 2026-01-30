# Microsoft 365 Copilot Support

This document describes the changes made to add Microsoft 365 Copilot support to the AI Prompt Injector extension.

## Changes Made

### 1. manifest.json
Added Microsoft 365 Copilot domain to both `host_permissions` and `content_scripts.matches`:
- Added: `"https://m365.cloud.microsoft/*"`

### 2. content.js
Added Microsoft 365 Copilot-specific DOM selectors to the `domainSelectors` object:
```javascript
'm365.cloud.microsoft': [
  '.fai-EditorInput[contenteditable="true"]',
  '.fai-ChatInput__editor [contenteditable="true"]',
  '[contenteditable="true"]'
]
```

These selectors target:
- `.fai-EditorInput[contenteditable="true"]` - The primary input element
- `.fai-ChatInput__editor [contenteditable="true"]` - Fallback for the editor container
- `[contenteditable="true"]` - Generic fallback for any contenteditable element

## Installation & Testing

### Step 1: Load the Extension in Firefox

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to the `ai-prompt-injector` folder
5. Select the `manifest.json` file
6. The extension should now appear in your Firefox toolbar

### Step 2: Test with Microsoft 365 Copilot

1. Navigate to Microsoft 365 Copilot: `https://m365.cloud.microsoft/chat`
2. **Important**: Refresh the page after installing the extension (F5 or Ctrl+R)
3. Click the AI Prompt Injector icon in the toolbar
4. Create a test prompt or use an existing one
5. Click "Insert" to inject the prompt into the Copilot input field

### Step 3: Troubleshooting

If the prompt doesn't insert:

1. **Check Console Logs**:
   - Press F12 to open Developer Tools
   - Go to the Console tab
   - Look for messages starting with `[ai_prompt_injector]`
   - These will show if the input field was detected

2. **Use the Debug Button**:
   - Click the "Debug" button in the extension popup
   - This will show if a valid input field was found
   - It will display the element type and attributes

3. **Verify Permissions**:
   - Go to `about:addons` in Firefox
   - Find "AI Prompt Injector"
   - Check that permissions are granted for Microsoft 365

4. **Refresh the Page**:
   - The content script only loads when the page loads
   - After installing or updating the extension, always refresh the page

## Technical Details

### How It Works

1. **Domain Detection**: The extension checks `window.location.hostname` to identify the current site
2. **Selector Priority**: It tries domain-specific selectors first, then falls back to generic ones
3. **Element Validation**: Each found element is validated to ensure it's visible and editable
4. **Text Insertion**: For contenteditable elements, it uses `innerText` or `textContent` and dispatches appropriate events

### DOM Structure (Microsoft 365 Copilot)

The input field structure:
```html
<div class="fai-ExpandableChatInput__contentBefore">
  <div class="fai-ChatInput__editor">
    <span class="fai-ChatInput__editor">
      <p class="fai-EditorInput" contenteditable="true" role="textbox">
        <!-- User input goes here -->
      </p>
    </span>
  </div>
</div>
```

## GitHub Access (Optional)

You don't need GitHub access to use these changes locally. However, if you want to:
- **Fork the repository**: Create your own copy to maintain
- **Submit a Pull Request**: Contribute these changes back to the original project
- **Share your modifications**: Make them available to others

To contribute back to the original project:
1. Fork the repository on GitHub
2. Create a new branch: `git checkout -b feature/m365-copilot-support`
3. Commit your changes: `git commit -am "Add Microsoft 365 Copilot support"`
4. Push to your fork: `git push origin feature/m365-copilot-support`
5. Create a Pull Request on the original repository

## Compatibility

- **Browser**: Firefox (Manifest V3)
- **Microsoft 365 Copilot**: Tested with the web interface at `m365.cloud.microsoft`
- **Extension Version**: Based on v1.1.0

## Future Improvements

Potential enhancements:
- Add support for other Microsoft 365 Copilot URLs if they exist
- Fine-tune selectors if Microsoft updates their UI
- Add specific handling for Microsoft 365's rich text features

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify the DOM structure hasn't changed (inspect the input element)
3. Update the selectors in `content.js` if needed
4. Report issues to the extension maintainer

---

**Last Updated**: January 30, 2026
**Author**: Custom modification for Microsoft 365 Copilot support