import "./protocol.js";

function syncGenerateButton() {
  const hasPost = currentPost != null;
  const hasPrompt = SELECTORS.promptInput.value.trim().length > 0;
  SELECTORS.generateBtn.disabled = !(hasPost || hasPrompt);
}

export function createUserPrompt({ author, postText } = {}) {
  return `Write a comment for ${author ?? "this post"} about "${postText ?? ""}"`;
}

function parseThePost(postHTML) {
  const postElement = new DOMParser().parseFromString(postHTML, "text/html");
  const authorEl = postElement.querySelector(LINKEDIN_SELECTORS.authorLabel);
  const textEl = postElement.querySelector(LINKEDIN_SELECTORS.postText);

  const author =
    authorEl
      ?.getAttribute("aria-label")
      ?.replace("Open control menu for post by ", "")
      .trim() || null;

  return { author, text: textEl?.innerText ?? null };
}

const SELECTORS = {
  templates: document.getElementsByClassName("template"),
  promptInput: document.getElementsByClassName("prompt__input")[0],
  generateBtn: document.getElementsByClassName("generate")[0],
  welcomeMessage: document.querySelector(".welcome"),
  title: document.querySelector("h1"),
  form: document.querySelector(".prompt"),
};

const LINKEDIN_SELECTORS = {
  commentButtonIcon: "button:has(#comment-small)",
  post: '[role="listitem"]',
  authorLabel: '[aria-label^="Open control menu for post by "]',
  postText: '[data-testid="expandable-text-box"]',
  editor: '[role="textbox"][aria-label="Text editor for creating comment"]',
};

let currentPost = null;

Array.from(SELECTORS.templates).forEach((template) => {
  template.addEventListener("click", () => {
    SELECTORS.promptInput.value = template.textContent
      .replace(/\s+/g, " ")
      .trim();
    syncGenerateButton();
  });
});

parent.postMessage(
  {
    type: EVY.MSG.SET_SELECTORS,
    matchSelector: LINKEDIN_SELECTORS.commentButtonIcon,
    containerSelector: LINKEDIN_SELECTORS.post,
  },
  "*",
);

SELECTORS.promptInput.addEventListener("input", () => {
  if (SELECTORS.promptInput.value.trim() === "") {
    SELECTORS.welcomeMessage.style.display = "";
    SELECTORS.title.textContent = "AI Writer";
    currentPost = null;
  }
  syncGenerateButton();
});

SELECTORS.form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentPost) return;

  SELECTORS.generateBtn.disabled = true;

  fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      author: currentPost.author,
      postText: currentPost.text,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.comment) {
        parent.postMessage(
          {
            type: EVY.MSG.INSERT_IN_ELEMENT,
            comment: data.comment,
            editorSelector: LINKEDIN_SELECTORS.editor,
          },
          "*",
        );
      } else {
        console.error("No comment returned from server:", data);
      }
    })
    .catch((err) => {
      console.error("Error generating comment:", err);
    })
    .finally(() => {
      SELECTORS.generateBtn.disabled = false;
      SELECTORS.promptInput.value = "";
    });
});

window.addEventListener("message", (msg) => {
  if (msg.data.type !== EVY.MSG.ELEMENT_CAPTURED) return;

  const { author, text: postText } = parseThePost(msg.data.elementHTML);

  currentPost = {
    author,
    text: postText,
  };

  SELECTORS.welcomeMessage.style.display = "none";
  SELECTORS.title.textContent = `Writing a comment for ${author ?? "this post"}`;
  SELECTORS.promptInput.value = createUserPrompt({
    author: author,
    postText: postText,
  });

  syncGenerateButton();
});
