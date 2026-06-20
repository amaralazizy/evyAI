const posts = new Map();
let nextPostId = 1;

document.addEventListener(
  "click",
  (e) => {
    const post = EVY.linkedin.postFromCommentButton(e.target);
    if (!post) return;

    const postId = nextPostId++;
    posts.set(postId, post);

    const { author, text } = EVY.linkedin.readPost(post) ?? {};
    chrome.runtime.sendMessage({
      type: EVY.MSG.COMMENT_CLICKED,
      postId,
      post: { author, text },
    });
  },
  true,
);

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== EVY.MSG.COMMENT_GENERATED) return;

  const editor = EVY.linkedin.findEditor(posts.get(msg.postId));
  if (!editor) {
    console.warn("comment editor not found — is the comment box open?");
    return;
  }
  EVY.linkedin.insertComment(editor, msg.comment);
});
