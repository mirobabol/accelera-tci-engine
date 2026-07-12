exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { query, source = 'news' } = JSON.parse(event.body);
  const apiKey = process.env.DATA_PROVIDER_API_KEY;

  if (!apiKey) {
    // Sandbox Mode Fallback
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'sandbox',
        message: `API Key missing. Simulating live discovery for query: ${query}`,
        results: [
          { companyName: `${query} Global`, industry: "Manufacturing", signals: ["Expansion into LATAM", "New CEO appointed"] },
          { companyName: `${query} Logistics`, industry: "Supply Chain", signals: ["Margin compression reported", "Fleet renewal"] }
        ]
      })
    };
  }

  try {
    // Live Production Fetch (e.g., NewsAPI or Clearbit)
    // This executes securely on the Netlify edge, bypassing all browser CORS restrictions.
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`);
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'live',
        message: `Successfully pulled live data for: ${query}`,
        results: data.articles ? data.articles.slice(0, 5) : []
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
