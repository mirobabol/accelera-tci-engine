// LLM AI Integration Service (Phase 12)

export const generateChainOfThought = async (prospectData) => {
  // Try secure Netlify Backend first (Phase 18 Sprint 1)
  try {
    const res = await fetch('/.netlify/functions/llm', {
      method: 'POST',
      body: JSON.stringify({ prospectData })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.log("Secure Backend not found, falling back to local client processing...");
  }

  // Fallback to local client processing
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'mock-key') {
    console.warn("Using Mock LLM. Awaiting Gemini API Key.");
    return {
      reasoning: [
        "> INITIALIZING AI LOGIC STREAM...",
        "> ANALYZING FIRMOGRAPHICS: " + prospectData.company,
        "> DETECTED: Margin expansion in recent quarter.",
        "> SYNERGY MATCH: High alignment with Coface TC parameters.",
        "> RECOMMENDATION: Immediate Outreach."
      ],
      scores: { res: 88, aps: 92, acs: 75 }
    };
  }

  // Live Gemini Integration
  try {
    const prompt = `You are an expert AI intelligence engine for Coface Trade Credit. Analyze this prospect and output a raw logic stream (max 5 lines). Each line MUST start with "> ". Keep it terse and cyber-aesthetic. Prospect: ${JSON.stringify(prospectData)}`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await response.json();
    const textResult = data.candidates[0].content.parts[0].text;
    
    return {
      reasoning: textResult.split('\\n').filter(l => l.trim().length > 0),
      scores: { 
        res: Math.floor(Math.random()*20 + 75), 
        aps: Math.floor(Math.random()*20 + 75), 
        acs: Math.floor(Math.random()*20 + 75) 
      }
    };
  } catch (err) {
    console.error("LLM Generation Error:", err);
    return null;
  }
};
