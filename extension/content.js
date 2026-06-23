let activeEl = null;
let selectors = null;

document.addEventListener(
  "click",
  (e) => {
    if (!selectors) return;
    const clicked = e.target.closest(selectors.matchSelector);
    if (!clicked) return;
    const container = clicked.closest(selectors.containerSelector);
    if (!container) return;

    activeEl = container;

    chrome.runtime.sendMessage({
      type: EVY.MSG.ELEMENT_CAPTURED,
      elementHTML: container.outerHTML,
    });
  },
  true,
);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== EVY.MSG.INSERT_IN_ELEMENT) return;

  const editor = activeEl?.querySelector(msg.editorSelector);
  if (!editor) {
    console.warn("comment editor not found — is the comment box open?");
    return;
  }
  editor.focus();
  editor.innerText = msg.comment;
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== EVY.MSG.SET_SELECTORS) return;
  selectors = {
    matchSelector: msg.matchSelector,
    containerSelector: msg.containerSelector,
  };
});
