// Base connector interface for registry providers
export class RegistryProvider {
  async searchCompanies(query) { throw new Error("Not implemented"); }
  async getFinancials(ico) { throw new Error("Not implemented"); }
  async getOfficers(ico) { throw new Error("Not implemented"); }
  async getOwnershipHistory(ico) { throw new Error("Not implemented"); }
}

export class ORSRConnector extends RegistryProvider {
  async searchCompanies(query) {
    // Stub: In Phase 2, this will hit orsr.sk open data API or scrape logic
    console.log(`[ORSR] Searching for ${query}`);
    return [{ ico: '12345678', name: query, type: 's.r.o.', founded: '2020-01-01' }];
  }
  
  async getOfficers(ico) {
    // Stub for statutory reps
    return [{ name: 'Jozef Mak', role: 'Konatel', activeSince: '2020-01-01' }];
  }
}
