import { defineLogicFunction } from 'twenty-sdk/define';

export default defineLogicFunction({
  name: 'calculateContractPrice',
  description: 'Calculates contract prices based on LME rates',
  input: {
    contractId: { type: 'string' },
    metalType: { type: 'string' }
  },
  output: {
    calculatedPrice: { type: 'number' }
  },
  async execute({ input, context }) {
    // 1. Fetch the latest LME Tracker rate
    const lmeRecords = await context.api.findMany('lmeTrackers', {
      filter: { metalType: { eq: input.metalType } },
      orderBy: { rateDate: 'Desc' },
      limit: 1
    });

    if (!lmeRecords || lmeRecords.length === 0) {
      throw new Error(`No LME rate found for metal type: ${input.metalType}`);
    }

    const latestLme = lmeRecords[0];

    // 2. Fetch the contract details
    const contract = await context.api.findOne('contracts', input.contractId);

    if (!contract) {
      throw new Error(`Contract not found for ID: ${input.contractId}`);
    }

    // 3. Apply basic pricing formula (e.g. LME Rate * 0.95 depending on contract's lmeFormula)
    // Here we simulate parsing the lmeFormula, e.g. "LME * 0.95"
    let multiplier = 1;
    if (contract.lmeFormula && contract.lmeFormula.includes('*')) {
       const parts = contract.lmeFormula.split('*');
       multiplier = parseFloat(parts[1].trim()) || 1;
    }

    const finalPrice = latestLme.rateUSD * multiplier;

    return { calculatedPrice: finalPrice };
  }
});
