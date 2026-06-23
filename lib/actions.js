import { buildMessages } from "./prompt.js";
import { openRouter } from "./openrouter.js";

export async function generateComment({ author, postText, model = "openai/gpt-4o-mini" }) {
  const r = await openRouter.chat.send({
    chatRequest: { model, messages: buildMessages({ author, postText }) },
  });
  console.log("response:", r.choices[0].message.content);
  return r.choices[0].message.content;
}
