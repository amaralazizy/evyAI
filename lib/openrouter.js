import { OpenRouter } from "@openrouter/sdk";
import dotenv from "dotenv";

dotenv.config();

export const openRouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
