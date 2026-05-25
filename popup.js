const STORAGE_KEY = "tabStates";

const toggleButton = document.getElementById("toggleButton");
const statusText = document.getElementById("statusText");

const getActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
};

const getTabStates = async () => {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  return data[STORAGE_KEY] ?? {};
};

const updatePopupUi = (enabled) => {
  toggleButton.dataset.enabled = String(enabled);
  toggleButton.textContent = enabled ? "Disable" : "Enable";
  statusText.textContent = enabled
    ? "Dark mode is on for this tab."
    : "Dark mode is off for this tab.";
};

const initialize = async () => {
  const activeTab = await getActiveTab();
  if (!activeTab?.id) {
    toggleButton.disabled = true;
    statusText.textContent = "No active tab available.";
    return;
  }

  const tabStates = await getTabStates();
  updatePopupUi(Boolean(tabStates[String(activeTab.id)]));

  toggleButton.addEventListener("click", async () => {
    const enabled = toggleButton.dataset.enabled === "true";
    const response = await chrome.runtime.sendMessage({
      type: "TOGGLE_DARK_MODE",
      tabId: activeTab.id,
      enabled: !enabled
    });

    updatePopupUi(Boolean(response?.enabled));
  });
};

initialize().catch(() => {
  statusText.textContent = "Failed to load extension state.";
});
