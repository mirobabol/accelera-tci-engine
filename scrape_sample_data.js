import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

async function generateSampleData() {
  console.log("Connecting to OpenAI to synthesize sample prospect data...");
  const prompt = `
    You are an AI Prospecting Engine. Generate 10 highly detailed, realistic B2B corporate prospect profiles for a consulting firm (Accelera Consulting).
    Return a JSON object with a single key 'prospects' containing an array of objects.
    Each object must have exactly these fields:
    - id (string, like 'uuid')
    - companyName (string)
    - industry (string, e.g. 'Fintech', 'Logistics', 'Healthcare', 'SaaS')
    - naceCode (string, e.g. '62.01')
    - annualRevenue (number, in millions)
    - employeeCount (number)
    - headquarters (string)
    - status (string, randomly pick one: 'New', 'Researched', 'Contacted', 'Meeting', 'Interested', 'Offer Sent', 'Signed', 'Declined')
    - keyDecisionMaker (object with 'name', 'title', 'linkedinProfile' strings)
    - aiScore (number 1-100, representing Accelera ideal client match quality)
    - recentSignals (array of 2 strings, e.g. "Just raised Series B", "Hiring new CTO")
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    const data = JSON.parse(content);
    
    fs.writeFileSync('./src/data/mockProspects.json', JSON.stringify(data.prospects, null, 2));
    console.log("Successfully scraped/synthesized 10 prospects into ./src/data/mockProspects.json");
  } catch(e) {
    console.error("Error generating data:", e);
  }
}

generateSampleData();
