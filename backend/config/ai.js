import axios from "axios";

const models = [
  "openai/gpt-3.5-turbo",
  "google/gemma-7b-it:free",
  "mistralai/mistral-7b-instruct:free",
];

export const askAIModel = async (message) => {
  for (let model of models) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: [
            {
              role: "user",
              content: `You are a healthcare assistant.

User symptoms: ${message}

Give simple advice and suggest doctor type.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Doctor AI App",
          },
        }
      );

      return response.data.choices[0].message.content;

    } catch (error) {
      console.log(`Model failed: ${model}`);
    }
  }

  throw new Error("All AI models failed. Try again later.");
};