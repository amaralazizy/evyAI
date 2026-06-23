importScripts("protocol.js");

chrome.runtime.onInstalled.addListener(() =>
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }),
);

const TO_CONTENT = new Set([
  EVY.MSG.SET_SELECTORS,
  EVY.MSG.INSERT_IN_ELEMENT,
]);

chrome.runtime.onMessage.addListener((msg) => {
  if (!TO_CONTENT.has(msg.type)) return;
  chrome.tabs.query({ url: "https://*.linkedin.com/*" }, (tabs) => {
    for (const t of tabs) chrome.tabs.sendMessage(t.id, msg).catch(() => {});
  });
});
