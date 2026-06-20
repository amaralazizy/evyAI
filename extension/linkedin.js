(() => {
  const SELECTORS = {
    commentButtonIcon: "#comment-small",
    post: '[role="listitem"]',
    authorLabel: '[aria-label^="Open control menu for post by "]',
    postText: '[data-testid="expandable-text-box"]',
    editor: '[role="textbox"][aria-label="Text editor for creating comment"]',
  };

  function postFromCommentButton(target) {
    const btn = target.closest("button");
    if (!btn || !btn.querySelector(SELECTORS.commentButtonIcon)) return null;
    return btn.closest(SELECTORS.post);
  }

  function readPost(postEl) {
    if (!postEl) return null;
    const label = postEl
      .querySelector(SELECTORS.authorLabel)
      ?.getAttribute("aria-label");
    const author = label?.replace(/^Open control menu for post by /, "") ?? null;
    const text = postEl.querySelector(SELECTORS.postText)?.innerText ?? null;
    return { author, text };
  }

  function findEditor(postEl) {
    return postEl?.querySelector(SELECTORS.editor) ?? null;
  }
  
  function insertComment(editor, text) {
    editor.focus();
    document.execCommand("selectAll", false, null);
    document.execCommand("insertText", false, text);
  }

  globalThis.EVY = Object.freeze({
    ...(globalThis.EVY || {}),
    linkedin: Object.freeze({
      postFromCommentButton,
      readPost,
      findEditor,
      insertComment,
    }),
  });
})();
