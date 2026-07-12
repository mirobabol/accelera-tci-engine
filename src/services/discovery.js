// Public Data Discovery Agent (Phase 13.1)

/**
 * Scrapes open public APIs to evaluate baseline data availability before requiring user uploads.
 * Currently configured to pull firmographic intelligence from Wikipedia's open graph.
 */
export const runDiscoveryAgent = async (companyName) => {
  console.log(`[AGENT] Initiating Public Discovery on entity: ${companyName}`);
  
  const intelligence = {
    companyName: companyName,
    logoUrl: `https://logo.clearbit.com/${companyName.replace(/\\s+/g, '').toLowerCase()}.com`,
    description: null,
    dataSource: "Unknown"
  };

  try {
    // Ping Wikipedia Open Action API (CORS-friendly)
    const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(companyName)}`);
    const wikiData = await wikiRes.json();
    
    if (wikiData.query && wikiData.query.pages) {
      const pages = wikiData.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pageId !== "-1" && pages[pageId].extract) {
        intelligence.description = pages[pageId].extract.split('\\n')[0]; // Get first paragraph
        intelligence.dataSource = "Wikipedia API";
      }
    }
    
    return intelligence;
  } catch (e) {
    console.error("Discovery Agent Error:", e);
    return intelligence;
  }
};
