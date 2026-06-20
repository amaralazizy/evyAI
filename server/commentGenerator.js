import { buildMessages } from "../extension/prompt.js";

export function createCommentGenerator({ chat } = {}) {
  if (typeof chat !== "function") {
    throw new TypeError("createCommentGenerator requires a chat function");
  }

  return {
    async generate(intent) {
      return chat(buildMessages(intent));
    },
  };
}
