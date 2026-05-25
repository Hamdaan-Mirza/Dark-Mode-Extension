const STORAGE_KEY = "tabStates";

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(STORAGE_KEY);
  if (!existing[STORAGE_KEY]) {
    await chrome.storage.local.set({ [STORAGE_KEY]: {} });
  }
});

const getTabStates = async () => {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  return stored[STORAGE_KEY] ?? {};
};

const setTabState = async (tabId, enabled) => {
  const tabStates = await getTabStates();
  tabStates[String(tabId)] = enabled;
  await chrome.storage.local.set({ [STORAGE_KEY]: tabStates });
};

const applyDarkModeState = async (tabId, enabled) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"]
  });

  if (enabled) {
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ["content.css"]
    });
  } else {
    await chrome.scripting.removeCSS({
      target: { tabId },
      files: ["content.css"]
    });
  }

  await chrome.tabs.sendMessage(tabId, {
    type: "APPLY_DARK_MODE",
    enabled
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== "TOGGLE_DARK_MODE") {
    return;
  }

  const handleToggle = async () => {
    const tabId = Number(message.tabId ?? sender.tab?.id);
    if (Number.isNaN(tabId) || tabId <= 0) {
      return { enabled: false, error: "Missing tab id." };
    }

    const enabled = Boolean(message.enabled);

    await applyDarkModeState(tabId, enabled);
    await setTabState(tabId, enabled);

    return { enabled };
  };

  handleToggle()
    .then(sendResponse)
    .catch(() => {
      sendResponse({ enabled: false, error: "Failed to update dark mode." });
    });

  return true;
});
