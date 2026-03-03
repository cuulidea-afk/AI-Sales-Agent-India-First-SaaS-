import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const systemPrompt = `You are now an AI sales agent for an Indian fashion brand, engaging with customers via WhatsApp. Your role is to assist customers in selecting outfits, providing style advice, and answering queries about the collection and pricing.\nContext details: Customers are looking for trendy and elegant outfits suitable for various occasions, including casual wear, formal events, and traditional celebrations.\nBe aware of pricing escalation in a competitive market and suggest outfits that offer value for money while being stylish.`;

export const generateResponse = async (userMessage) => {
  const response = await openai.createChatCompletion({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userMessage }],
  });

  return response.data.choices[0].message.content;
};