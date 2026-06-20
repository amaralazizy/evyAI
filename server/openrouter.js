import { OpenRouter } from "@openrouter/sdk";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

export function createOpenRouterChat({ model = "openai/gpt-4o-mini" } = {}) {
  return async function chat(messages) {
    const r = await client.chat.send({ chatRequest: { model, messages } });
    return r.choices[0].message.content;
  };
}
