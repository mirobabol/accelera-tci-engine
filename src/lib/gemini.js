import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function analyzeProspectForRadar(companyName, officers, description) {
  if (!genAI) {
    console.warn("Gemini API key missing, returning mock analysis.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      isSpinOff: true,
      spinOffConfidence: 0.85,
      ambitionScore: 70,
      evidence: "Mock evidence: The director previously held a senior role at a similar established firm."
    };
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    You are a Trade Credit Insurance (TCI) intelligence engine. 
    Analyze the following company data to determine if it fits a "Spin-off" or "Serial Mover" pattern.
    Company Name: ${companyName}
    Officers: ${JSON.stringify(officers)}
    Description: ${description}

    Return ONLY a JSON object with no markdown formatting:
    {
      "isSpinOff": boolean,
      "spinOffConfidence": number between 0 and 1,
      "ambitionScore": number between 0 and 100 based on language,
      "evidence": "a short sentence explaining why"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
}
