import { GoogleGenAI, Type } from "@google/genai";
import { ContentItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateSummary = async (title: string, description: string, type: string): Promise<string> => {
  try {
    const prompt = `Write a short, exciting and cinematic summary for the ${type.toLowerCase()} '${title}'. The official description is: '${description}'. Make it sound like a movie trailer voice-over. Do not start with "Here is a summary".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Sorry, I couldn't generate a summary at this time.";
  }
};

export const recommendContent = async (content: ContentItem[], userInput: string): Promise<{ recommendedContentId: number | null; explanation: string; }> => {
  try {
    const contentList = content.map(c => ({ id: c.id, title: c.title, genre: c.genre, year: c.year, type: c.type, description: c.description }));
    const prompt = `
      You are an expert content recommender for a streaming service.
      Based on the user's request, you must recommend ONE item from the provided JSON list of available content (which includes movies, TV series, and TV programs).
      If no content is a good fit, you must not recommend one.

      Your response MUST be a valid JSON object with the following structure: { "recommendedContentId": number | null, "explanation": "string" }.
      - 'recommendedContentId' must be the ID of an item from the list, or null if no item is a good match.
      - 'explanation' should be a friendly, short reason for your choice or an explanation of why no item fits.

      Content List:
      ${JSON.stringify(contentList)}

      User Request: "${userInput}"
    `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        recommendedContentId: { type: Type.INTEGER, nullable: true },
        explanation: { type: Type.STRING },
      },
      required: ["recommendedContentId", "explanation"],
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse;

  } catch (error) {
    console.error("Error recommending content:", error);
    return {
      recommendedContentId: null,
      explanation: "Sorry, I'm having trouble finding a recommendation right now. Please try again."
    };
  }
};
