import OpenAI from "openai";

const client = new OpenAI({
  apiKey: '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',
});

const systemMessage = {
  role: "system",
  content:
    "Tanya di tentang HIV/AIDS",
};

export const getStreamingCompletion = async ({ userPrompt }) => {
  return client.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [systemMessage, { role: "user", content: userPrompt }],
    stream: true,
    temperature: 0.7
  });
};

