(() => {
  if (window.universalDarkModeExtensionInitialized) {
    return;
  }

  window.universalDarkModeExtensionInitialized = true;

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== "APPLY_DARK_MODE") {
      return;
    }

    document.documentElement.classList.toggle(
      "dark-mode-enabled",
      Boolean(message.enabled)
    );
  });
})();
