const iframe = document.getElementById("app");

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== EVY.MSG.ELEMENT_CAPTURED) return;
  iframe.contentWindow.postMessage(msg, "*");
});

window.addEventListener("message", (msg) => {
  const data = msg.data;
  if (!data || typeof data.type !== "string") return;
  chrome.runtime.sendMessage(data);
});
