# Dark-Mode-Extension

A lightweight Chrome extension that applies a universal dark mode across web pages and images.

## Files

- `manifest.json` — Manifest V3 configuration with minimal permissions (`activeTab`, `scripting`, `storage`).
- `popup.html` / `popup.js` — Popup UI and logic to toggle dark mode for the active tab.
- `background.js` — Service worker handling state persistence and script/style injection.
- `content.js` / `content.css` — Applies and removes a `dark-mode-enabled` class and inversion styles for pages and media.
