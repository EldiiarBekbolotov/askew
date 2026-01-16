
import { GoogleGenAI } from "@google/genai";

// Fix: Updated service to follow guidelines for initialization and direct API usage
export const generateGameCommentary = async (score: number, highScore: number): Promise<string> => {
    try {
        // Fix: Always initialize right before making an API call using the required named parameter
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const isNewHigh = score >= highScore && score > 0;

        const prompt = `
      I just finished a round of a difficult infinite runner game called "Neon Slope".
      My score: ${score}.
      My all-time high score: ${highScore}.
      Is new high score: ${isNewHigh}.
      
      Act as a futuristic, slightly snarky but encouraging robot sports commentator. 
      Give me a ONE sentence reaction to my performance. 
      If it's a low score (under 50), roast me gently. 
      If it's high (over 100), praise me.
      If it's a new high score, celebrate wildly.
    `;

        // Fix: Call generateContent with the model name and prompt string
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        // Fix: Access response.text directly as a property (not a method)
        return response.text || "Connection terminated. Try again runner.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Communication systems offline.";
    }
};
