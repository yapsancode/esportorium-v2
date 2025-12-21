import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
    if (!process.env.API_KEY) {
        console.warn("API_KEY is missing from environment variables.");
        return null;
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTournamentDetails = async (
    gameName: string,
    tournamentName: string
): Promise<{ description: string; rules: string } | null> => {
    const ai = getAiClient();
    if (!ai) return null;

    const prompt = `
    You are an expert esports tournament organizer for Mobile Legends: Bang Bang (MLBB) in Malaysia.
    Create a compelling, short description (max 2 sentences) and a concise list of 3-5 key rules for an esports tournament.
    Focus on things like Draft Pick mode, Ban phases, or sportsmanship.
    
    Tournament Name: ${tournamentName}
    Game: ${gameName}

    Return the response in strict JSON format:
    {
      "description": "...",
      "rules": "..."
    }
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text;
        if (!text) return null;

        return JSON.parse(text);
    } catch (error) {
        console.error("Error generating tournament details:", error);
        return null;
    }
};

export const predictMatchOutcome = async (
    p1Name: string,
    p1Rank: string,
    p2Name: string,
    p2Rank: string,
    game: string
): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "Prediction unavailable";

    const prompt = `
    Act as an esports analyst for Mobile Legends. Predict a winner between these two teams/players.
    Team 1: ${p1Name} (Rank: ${p1Rank})
    Team 2: ${p2Name} (Rank: ${p2Rank})
    
    Give a one sentence analytical prediction considering the current meta.
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });
        return response.text || "No prediction.";
    } catch (error) {
        return "Prediction unavailable due to error.";
    }
};
