(() => {
  if (window.__universalDarkModeInitialized) {
    return;
  }

  window.__universalDarkModeInitialized = true;

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
