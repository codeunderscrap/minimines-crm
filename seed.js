const axios = require('axios');

const API_KEY = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYyMDI2ODQzLTA5ZDItNDM5My05NTM1LTZlODJhNTE3ZjRmNCJ9.eyJzdWIiOiI2MWJlMjBjYi1jMGQ2LTRiZTAtYWYxNy02YzUwMDY3NmRmOWIiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNjFiZTIwY2ItYzBkNi00YmUwLWFmMTctNmM1MDA2NzZkZjliIiwiaWF0IjoxNzgzNjg1MzQ0LCJleHAiOjQ5MzcyODUzNDEsImp0aSI6Ijg5YjcwMjEyLTY0NzktNDc2Zi05Y2ZlLTEyMTVkZDgyZWVmZCJ9.lPQmTpJ7lAK73_4ToKzb_FeiQbXbgC-h732qCGP7ezgBj8sPolSaILQh755UcVcr_pesNJdMI9gMS7V2c1GjsA';
const BASE_URL = 'https://api.twenty.com/rest';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

async function seed() {
  try {
    // 1. Contract
    const contractRes = await axios.post(`${BASE_URL}/contracts`, {
      name: 'Global Aluminium Supply Agreement 2026',
      startDate: '2026-07-01T00:00:00.000Z',
      endDate: '2027-06-30T00:00:00.000Z',
      totalQuantity: 5000,
      lmeFormula: 'LME Cash + Premium $120/MT',
      status: 'ACTIVE'
    }, { headers });
    const contractId = contractRes.data.data.id;
    console.log('Contract created:', contractId);

    // 2. Sales Order
    const soRes = await axios.post(`${BASE_URL}/salesOrders`, {
      name: 'SO-AL-26-001',
      orderNumber: 'ORD-2026-901',
      orderDate: '2026-07-10T00:00:00.000Z',
      quantity: 500,
      fulfillmentStatus: 'IN_PROGRESS'
    }, { headers });
    const soId = soRes.data.data.id;
    console.log('Sales Order created:', soId);

    // 3. Export Shipment
    const shipRes = await axios.post(`${BASE_URL}/exportShipments`, {
      name: 'Shipment-AL-01-Rotterdam',
      vesselName: 'MSC Isabella',
      containerNumber: 'MSCU1234567',
      shipmentDate: '2026-07-15T00:00:00.000Z',
      qaStatus: 'PASSED',
      documentationStatus: 'READY'
    }, { headers });
    console.log('Export Shipment created:', shipRes.data.data.id);

    // 4. LME Tracker
    const lmeRes = await axios.post(`${BASE_URL}/lMETrackers`, {
      name: 'Aluminium Cash Official - 11 July 2026',
      metalType: 'AL',
      rateDate: '2026-07-11T00:00:00.000Z',
      rateUSD: 2450.50,
      source: 'London Metal Exchange'
    }, { headers });
    console.log('LME Tracker created:', lmeRes.data.data.id);

  } catch (error) {
    console.error('Seed error:', error.response?.data || error.message);
  }
}

seed();
