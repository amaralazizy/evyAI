import express from "express";
import cors from "cors";
import { createCommentGenerator } from "./commentGenerator.js";
import { createOpenRouterChat } from "./openrouter.js";

const generator = createCommentGenerator({ chat: createOpenRouterChat() });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { author, postText } = req.body ?? {};
  if (!author && !postText) {
    return res
      .status(400)
      .json({ error: "author or postText required" });
  }
  try {
    const comment = await generator.generate({ author, postText });
    res.json({ comment });
  } catch (e) {
    res.status(500).json({ error: String(e?.message ?? e) });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("evyAI backend on :3000"),
);
