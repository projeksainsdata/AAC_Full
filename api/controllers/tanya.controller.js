// controllers/chatController.js
import { getStreamingCompletion } from "../src/modules/openai/index.js";

export const postChat = async (req, res) => {
    const data = req.body;
    const stream = await getStreamingCompletion({ userPrompt: data?.userPrompt });
    for await (const part of stream) {
        res.write(part.choices[0]?.delta.content || "");
    }
    res.end();
};
