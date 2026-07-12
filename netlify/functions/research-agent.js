exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { targetName, rawText } = JSON.parse(event.body);
  const geminiApiKey = process.env.VITE_GEMINI_API_KEY;

  if (!geminiApiKey) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'sandbox',
        agent: 'ResearchAgent',
        findings: [
          `Detected supply chain risk for ${targetName}`,
          `Positive sentiment in recent Q3 earnings report`
        ],
        structuredRiskJSON: {
          supplyChainRisk: "High",
          financialHealth: "Stable"
        }
      })
    };
  }

  // Phase 21 Sprint 1: The Research Agent
  // This agent specifically ingests unstructured news text and outputs structured JSON
  const prompt = `
    You are an expert financial Research Agent.
    Read the following unstructured news text about ${targetName}.
    Extract any intelligence signals, classify them, and return ONLY a valid JSON object 
    with a 'findings' array and a 'structuredRiskJSON' object.
    
    Raw Text:
    ${rawText}
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    
    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    
    return {
      statusCode: 200,
      body: resultText // Already JSON from Gemini
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
