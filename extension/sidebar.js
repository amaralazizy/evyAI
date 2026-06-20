import { createUserPrompt } from "./prompt.js";

const SELECTORS = {
  templates: document.getElementsByClassName("template"),
  promptInput: document.getElementsByClassName("prompt__input")[0],
  generateBtn: document.getElementsByClassName("generate")[0],
  welcomeMessage: document.querySelector(".welcome"),
  title: document.querySelector("h1"),
  form: document.querySelector(".prompt")
};

let currentPost = null;

function syncGenerateButton() {
  const hasPost = currentPost != null;
  const hasInstruction = SELECTORS.promptInput.value.trim().length > 0;
  SELECTORS.generateBtn.disabled = !(hasPost || hasInstruction);
}

Array.from(SELECTORS.templates).forEach((template) => {
  template.addEventListener("click", () => {
    SELECTORS.promptInput.value = template.textContent.replace(/\s+/g, " ").trim();
    syncGenerateButton();
  });
});

SELECTORS.promptInput.addEventListener("input", syncGenerateButton);


SELECTORS.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const instruction = SELECTORS.promptInput.value.trim();
  if (!currentPost && !instruction) return;
  SELECTORS.generateBtn.disabled = true;

  chrome.runtime.sendMessage(
    {
      type: EVY.MSG.GENERATE,
      postId: currentPost?.postId ?? null,
      intent: {
        author: currentPost?.author ?? null,
        postText: currentPost?.text ?? null,
        instruction: instruction || null,
      },
    },
    (res) => {
      if (res?.error) console.error(res.error);
      SELECTORS.generateBtn.disabled = false;
    },
  );
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== EVY.MSG.COMMENT_CLICKED) return;
  currentPost = {
    author: msg.post.author,
    text: msg.post.text,
    postId: msg.postId,
  };
  SELECTORS.welcomeMessage.style.display = "none";
  SELECTORS.title.textContent = `Writing a comment for ${msg.post.author ?? "this post"}`;
  SELECTORS.promptInput.value = createUserPrompt({
    author: msg.post.author,
    postText: msg.post.text,
  });
  syncGenerateButton();
});
