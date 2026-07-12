// Scoring Engine Core Logic
// TCI Fit Score = weighted combination of RES, APS, ACS

const DEFAULT_WEIGHTS = {
  res: { sector: 0.4, financial: 0.4, turnover: 0.2 },
  aps: { spinoff: 0.4, digital: 0.3, ambition: 0.2, age: 0.1 },
  acs: { findability: 0.5, geography: 0.3, competitor: -0.2 }
};

export function calculateRES(companyData, weights = DEFAULT_WEIGHTS.res) {
  // Mock logic: Base 50 + sector adjustments
  let score = 50;
  if (['Spedition', 'Road transportation', 'Non-ferrous metals'].includes(companyData.sector)) {
    score += 30; // High structural risk
  }
  
  if (companyData.financials?.receivables > companyData.financials?.turnover * 0.3) {
    score += 15; // High DSO proxy
  }
  
  return Math.min(100, Math.max(0, score));
}

export function calculateAPS(companyData, weights = DEFAULT_WEIGHTS.aps) {
  let score = 40;
  if (companyData.patterns?.includes('spin-off')) {
    score += 35; 
  }
  if (companyData.digitalFootprint?.hasExportLanguage) {
    score += 20;
  }
  return Math.min(100, Math.max(0, score));
}

export function calculateACS(companyData, weights = DEFAULT_WEIGHTS.acs) {
  let score = 60;
  if (companyData.accessibility?.linkedinFound) {
    score += 20;
  }
  if (companyData.accessibility?.competitorFlag) {
    score -= 30;
  }
  return Math.min(100, Math.max(0, score));
}

export function getQuadrant(res, aps) {
  if (res >= 50 && aps >= 50) return 'Hot';
  if (res >= 50 && aps < 50) return 'Nurture';
  if (res < 50 && aps >= 50) return 'Opportunistic';
  return 'Deprioritize';
}

export function evaluateProspect(companyData) {
  const res = calculateRES(companyData);
  const aps = calculateAPS(companyData);
  const acs = calculateACS(companyData);
  
  return {
    ...companyData,
    res,
    aps,
    acs,
    type: getQuadrant(res, aps),
    compositeScore: Math.round((res + aps + acs) / 3)
  };
}

export function logOutcome(prospectId, outcome, currentWeights = DEFAULT_WEIGHTS) {
  console.log(`[Feedback Loop] Prospect ${prospectId} was marked as ${outcome}`);
  const newWeights = JSON.parse(JSON.stringify(currentWeights));
  
  if (outcome === 'Signed') {
    console.log("Strengthening successful heuristics...");
    newWeights.res.sector += 0.05; 
    newWeights.aps.spinoff += 0.05;
  } else if (outcome === 'Declined') {
    console.log("Penalizing failing heuristics...");
    newWeights.res.sector -= 0.02;
    newWeights.aps.spinoff -= 0.02;
  }
  
  return newWeights;
}
