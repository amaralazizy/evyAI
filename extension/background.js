importScripts("protocol.js");

chrome.runtime.onInstalled.addListener(() =>
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }),
);

const sessions = new Map();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === EVY.MSG.COMMENT_CLICKED) {
    if (msg.postId != null && sender.tab?.id != null) {
      sessions.set(msg.postId, { tabId: sender.tab.id });
    }
    return;
  }

  if (msg.type === EVY.MSG.GENERATE) {
    fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg.intent),
    })
      .then((r) => r.json())
      .then((data) => {
        const session = sessions.get(msg.postId);
        if (data.comment && session?.tabId != null) {
          chrome.tabs.sendMessage(session.tabId, {
            type: EVY.MSG.COMMENT_GENERATED,
            comment: data.comment,
            postId: msg.postId,
          });
        }
        sendResponse(data);
      })
      .catch((e) => sendResponse({ error: String(e) }));
    return true;
  }
});
