(() => {
  if (window.universalDarkModeExtensionInitialized) {
    return;
  }

  window.universalDarkModeExtensionInitialized = true;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "PING_DARK_MODE_CONTENT_SCRIPT") {
      sendResponse({ ready: true });
      return;
    }

    if (message?.type !== "APPLY_DARK_MODE") {
      return;
    }

    document.documentElement.classList.toggle(
      "dark-mode-enabled",
      Boolean(message.enabled)
    );
  });
})();
