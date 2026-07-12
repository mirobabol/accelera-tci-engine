import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

async function generateCohortData() {
  console.log("Connecting to OpenAI to synthesize Phase 4 cohort and persona data...");
  const prompt = `
    You are an AI Prospecting Engine generating mock data for a Cohort and Persona feature engine.
    Generate a JSON object with two keys: 'cohorts' and 'personas'.
    
    'cohorts' should be an array of 2 objects representing nested prospect groups.
    Fields per cohort:
    - cohortId (string)
    - name (string)
    - sourceQuery (object with text description of filter)
    - memberCompanyIds (array of 5 random uuid strings)
    - rankBy (string, e.g. "turnover", "growthRate")
    
    'personas' should be an array of 2 objects representing AI behavioral personas.
    Fields per persona:
    - personaId (string)
    - name (string)
    - seedCompanyIds (array of 2 uuid strings)
    - featureVector (object with: turnoverGrowthSteepness, marginTrend, profitabilityTrend, exportShareTrend, headcountGrowthTrend, socialMediaActivityLevel, newsMentionFrequency - all floats between 0.0 and 1.0)
    - starRating (integer 1 to 5)
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
    
    fs.writeFileSync('./src/data/mockCohorts.json', JSON.stringify(data, null, 2));
    console.log("Successfully scraped/synthesized cohort and persona data into ./src/data/mockCohorts.json");
  } catch(e) {
    console.error("Error generating cohort data:", e);
  }
}

generateCohortData();
