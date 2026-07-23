#!/usr/bin/env node
// seed-demo-data.js — Seeds professional demo data across all MiniMines CRM modules
// Run: node seed-demo-data.js

const API = 'https://api.twenty.com/rest';
const TOKEN = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ';

// Workspace member IDs (from actual workspace)
const MEMBERS = {
  HOD_MANN:      '4037190d-ef8c-48b6-becf-7b6fd3a9bc74',
  HOD_ARSALAN:   '4749fcbe-a2b2-4b7e-ac5e-f842e390d46d',
  ASSOCIATE_S1:  '9d49a342-eb4b-428e-a543-57f109c2477f',
  MANAGER_EXEC:  'fe7aaccc-cae2-4d06-9cdc-1df46355da55',
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function post(endpoint, body) {
  const res = await fetch(`${API}/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (res.status === 429) {
    console.log('  ⏳ Rate limited, waiting 35s...');
    await delay(35000);
    return post(endpoint, body);
  }
  const json = await res.json();
  if (!res.ok) {
    console.error(`  ❌ ${endpoint}: ${res.status}`, JSON.stringify(json).substring(0, 200));
    return null;
  }
  return json.data || json;
}

async function seed() {
  console.log('\n🏭 MiniMines CRM — Seeding Professional Demo Data\n');

  // ═══════════════════════════════════════════════════════════════
  // 1. PRODUCTS — Material catalog
  // ═══════════════════════════════════════════════════════════════
  console.log('📦 Seeding Products...');
  const products = [
    { sku: 'MM-LI-001', materialName: 'Battery-Grade Lithium Carbonate (Li₂CO₃)', category: 'BATTERY_MATERIAL', baseComposition: '99.5% Li₂CO₃, <50ppm Fe, <20ppm Na', targetLmeLinkage: 'LME Lithium', isAvailableForDomesticSale: true },
    { sku: 'MM-CO-001', materialName: 'Battery-Grade Cobalt Sulphate (CoSO₄)', category: 'BATTERY_MATERIAL', baseComposition: '20.5% Co, <10ppm Cd, <50ppm Fe', targetLmeLinkage: 'LME Cobalt', isAvailableForDomesticSale: true },
    { sku: 'MM-NI-001', materialName: 'Nickel Sulphate (NiSO₄·6H₂O)', category: 'BATTERY_MATERIAL', baseComposition: '22% Ni, <5ppm Cd, <30ppm Cu', targetLmeLinkage: 'LME Nickel', isAvailableForDomesticSale: true },
    { sku: 'MM-MN-001', materialName: 'Manganese Sulphate (MnSO₄·H₂O)', category: 'BATTERY_MATERIAL', baseComposition: '31.8% Mn, <10ppm Pb, <5ppm Cd', targetLmeLinkage: '', isAvailableForDomesticSale: true },
    { sku: 'MM-CU-001', materialName: 'Copper Cathode (Cu 99.99%)', category: 'RAW_MATERIAL', baseComposition: 'Cu 99.99%, LME Grade A', targetLmeLinkage: 'LME Copper', isAvailableForDomesticSale: true },
    { sku: 'MM-AL-001', materialName: 'Aluminum Ingot (P1020)', category: 'RAW_MATERIAL', baseComposition: 'Al 99.7%, Fe<0.2%, Si<0.1%', targetLmeLinkage: 'LME Aluminum', isAvailableForDomesticSale: false },
    { sku: 'MM-GP-001', materialName: 'Graphite Powder (Recycled)', category: 'BY_PRODUCT', baseComposition: '99.5% C, <0.3% ash', targetLmeLinkage: '', isAvailableForDomesticSale: true },
    { sku: 'MM-BM-001', materialName: 'Black Mass (Li-ion Recycled)', category: 'RAW_MATERIAL', baseComposition: 'Ni 12-15%, Co 5-8%, Li 3-5%, Mn 4-6%', targetLmeLinkage: '', isAvailableForDomesticSale: false },
  ];
  for (const p of products) { await post('products', p); await delay(1200); }

  // ═══════════════════════════════════════════════════════════════
  // 2. COMPANIES — Client & partner organizations
  // ═══════════════════════════════════════════════════════════════
  console.log('🏢 Seeding Companies...');
  const companies = [
    { name: { firstName: '', lastName: 'Amara Raja Energy & Mobility' }, domainName: { primaryLinkUrl: 'https://amararaja.com', primaryLinkLabel: '', secondaryLinks: [] }, address: { addressCity: 'Tirupati', addressState: 'Andhra Pradesh', addressCountry: 'India', addressStreet1: 'Renigunta', addressStreet2: '', addressPostcode: '517520', addressLat: null, addressLng: null } },
    { name: { firstName: '', lastName: 'Tata Chemicals Ltd' }, domainName: { primaryLinkUrl: 'https://tatachemicals.com', primaryLinkLabel: '', secondaryLinks: [] }, address: { addressCity: 'Mumbai', addressState: 'Maharashtra', addressCountry: 'India', addressStreet1: 'Bombay House, Homi Mody St', addressStreet2: '', addressPostcode: '400001', addressLat: null, addressLng: null } },
    { name: { firstName: '', lastName: 'Exide Industries Ltd' }, domainName: { primaryLinkUrl: 'https://exideindustries.com', primaryLinkLabel: '', secondaryLinks: [] }, address: { addressCity: 'Kolkata', addressState: 'West Bengal', addressCountry: 'India', addressStreet1: 'Exide House, 59E Chowringhee Rd', addressStreet2: '', addressPostcode: '700020', addressLat: null, addressLng: null } },
    { name: { firstName: '', lastName: 'Log9 Materials' }, domainName: { primaryLinkUrl: 'https://log9materials.com', primaryLinkLabel: '', secondaryLinks: [] }, address: { addressCity: 'Bengaluru', addressState: 'Karnataka', addressCountry: 'India', addressStreet1: 'KIADB Industrial Area, Doddaballapur', addressStreet2: '', addressPostcode: '561203', addressLat: null, addressLng: null } },
    { name: { firstName: '', lastName: 'Hindalco Industries' }, domainName: { primaryLinkUrl: 'https://hindalco.com', primaryLinkLabel: '', secondaryLinks: [] }, address: { addressCity: 'Mumbai', addressState: 'Maharashtra', addressCountry: 'India', addressStreet1: 'Aditya Birla Centre, Worli', addressStreet2: '', addressPostcode: '400030', addressLat: null, addressLng: null } },
  ];
  const companyIds = [];
  for (const c of companies) {
    const res = await post('companies', c);
    if (res) companyIds.push(res.companies ? res.companies.id : (res.id || null));
    await delay(1200);
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. PEOPLE — Contacts at client companies
  // ═══════════════════════════════════════════════════════════════
  console.log('👤 Seeding People (Contacts)...');
  const people = [
    { name: { firstName: 'Vikram', lastName: 'Sharma' }, jobTitle: 'VP - Procurement', emails: { primaryEmail: 'v.sharma@amararaja.com', additionalEmails: [] }, phones: { primaryPhoneNumber: '9876543210', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, companyId: companyIds[0] },
    { name: { firstName: 'Priya', lastName: 'Nair' }, jobTitle: 'Head of Supply Chain', emails: { primaryEmail: 'priya.nair@tatachemicals.com', additionalEmails: [] }, phones: { primaryPhoneNumber: '9812345678', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, companyId: companyIds[1] },
    { name: { firstName: 'Rajesh', lastName: 'Gupta' }, jobTitle: 'General Manager - Raw Materials', emails: { primaryEmail: 'rajesh.g@exideindustries.com', additionalEmails: [] }, phones: { primaryPhoneNumber: '9845671234', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, companyId: companyIds[2] },
    { name: { firstName: 'Akash', lastName: 'Mehta' }, jobTitle: 'Founder & CEO', emails: { primaryEmail: 'akash@log9materials.com', additionalEmails: [] }, phones: { primaryPhoneNumber: '9900112233', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, companyId: companyIds[3] },
    { name: { firstName: 'Sunil', lastName: 'Agarwal' }, jobTitle: 'Sr. Manager - Metal Sourcing', emails: { primaryEmail: 'sunil.a@hindalco.com', additionalEmails: [] }, phones: { primaryPhoneNumber: '9988776655', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, companyId: companyIds[4] },
    { name: { firstName: 'Deepika', lastName: 'Reddy' }, jobTitle: 'Head of R&D Procurement', emails: { primaryEmail: 'deepika.r@amararaja.com', additionalEmails: [] }, phones: { primaryPhoneNumber: '9871234567', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, companyId: companyIds[0] },
  ];
  for (const p of people) { await post('people', p); await delay(1200); }

  // ═══════════════════════════════════════════════════════════════
  // 4. LEADS — Prospective clients with role assignments
  // ═══════════════════════════════════════════════════════════════
  console.log('🎯 Seeding Leads...');
  const leads = [
    // Assigned to Associate S1
    { name: 'Greenko Group — Lithium Enquiry', company: 'Greenko Group', email: { primaryEmail: 'procurement@greenko.net', additionalEmails: [] }, phone: { primaryPhoneNumber: '9876501234', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, source: 'WEBSITE', status: 'NEW', assignedTo: 'UNASSIGNED', department: 'SALES', followUpStatus: 'NONE', acknowledgmentSent: false, notes: 'Interested in 5MT/month Li₂CO₃ for energy storage', assignedAssociateId: MEMBERS.ASSOCIATE_S1, assignedManagerPrimaryId: MEMBERS.MANAGER_EXEC },
    { name: 'Ather Energy — Cobalt Supply', company: 'Ather Energy Pvt Ltd', email: { primaryEmail: 'supply@atherenergy.com', additionalEmails: [] }, phone: { primaryPhoneNumber: '9845612378', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, source: 'LINKEDIN', status: 'CONTACTED', assignedTo: 'UNASSIGNED', department: 'SALES', followUpStatus: 'FOLLOW_UP_1', acknowledgmentSent: true, notes: 'EV scooter battery pack needs CoSO₄ supply', assignedAssociateId: MEMBERS.ASSOCIATE_S1, assignedManagerPrimaryId: MEMBERS.MANAGER_EXEC },
    // Assigned to Manager (Executive)
    { name: 'Waaree Energies — NMC Materials', company: 'Waaree Energies Ltd', email: { primaryEmail: 'rawmaterials@waaree.com', additionalEmails: [] }, phone: { primaryPhoneNumber: '9022334455', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, source: 'DIRECT', status: 'QUALIFIED', assignedTo: 'UNASSIGNED', department: 'BD', followUpStatus: 'FOLLOW_UP_2', acknowledgmentSent: true, notes: 'Need NMC precursor materials for cell manufacturing. Large volume potential 50MT/quarter.', assignedManagerPrimaryId: MEMBERS.MANAGER_EXEC },
    { name: 'Reliance New Energy — Black Mass', company: 'Reliance New Energy Ltd', email: { primaryEmail: 'procurement@rnel.com', additionalEmails: [] }, phone: { primaryPhoneNumber: '9167890123', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, source: 'DIRECT', status: 'CONTACTED', assignedTo: 'UNASSIGNED', department: 'BD', followUpStatus: 'FOLLOW_UP_1', acknowledgmentSent: true, notes: 'Exploring recycled black mass supply for their Jamnagar gigafactory', assignedManagerPrimaryId: MEMBERS.MANAGER_EXEC },
    { name: 'ISRO — Nickel Sulphate', company: 'Indian Space Research Organisation', email: { primaryEmail: 'materials@isro.gov.in', additionalEmails: [] }, phone: { primaryPhoneNumber: '0802269', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, source: 'CALL', status: 'QUALIFIED', assignedTo: 'UNASSIGNED', department: 'BD', followUpStatus: 'FOLLOW_UP_3', acknowledgmentSent: true, notes: 'Satellite battery program needs high-purity NiSO₄', assignedManagerPrimaryId: MEMBERS.MANAGER_EXEC },
    // HOD level (unassigned / direct)
    { name: 'Samsung SDI India — Cell Grade Materials', company: 'Samsung SDI India', email: { primaryEmail: 'india.procurement@samsung.com', additionalEmails: [] }, phone: { primaryPhoneNumber: '1244001234', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, source: 'LINKEDIN', status: 'NEW', assignedTo: 'UNASSIGNED', department: 'BD', followUpStatus: 'NONE', acknowledgmentSent: false, notes: 'Looking at India supply chain for upcoming Noida plant' },
    { name: 'BYD India — Manganese Supply', company: 'BYD India Pvt Ltd', email: { primaryEmail: 'sourcing@byd.co.in', additionalEmails: [] }, phone: { primaryPhoneNumber: '9560012345', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, source: 'WEBSITE', status: 'NEW', assignedTo: 'UNASSIGNED', department: 'SALES', followUpStatus: 'NONE', acknowledgmentSent: false, notes: 'Need LFP-grade MnSO₄ for EV bus batteries' },
    { name: 'CSIR-CECRI — Research Collaboration', company: 'CSIR-CECRI Karaikudi', email: { primaryEmail: 'director@cecri.res.in', additionalEmails: [] }, phone: { primaryPhoneNumber: '4565241544', primaryPhoneCountryCode: 'IN', primaryPhoneCallingCode: '+91', additionalPhones: [] }, source: 'CALL', status: 'CONTACTED', assignedTo: 'UNASSIGNED', department: 'BD', followUpStatus: 'FOLLOW_UP_1', acknowledgmentSent: true, notes: 'Joint research on next-gen cathode recycling processes' },
  ];
  for (const l of leads) { await post('leads', l); await delay(1200); }

  // ═══════════════════════════════════════════════════════════════
  // 5. ENQUIRIES — Incoming questions
  // ═══════════════════════════════════════════════════════════════
  console.log('💬 Seeding Enquiries...');
  const enquiries = [
    { customerName: 'Rajesh Kumar (Amara Raja)', source: 'WEBSITE', message: 'We need a quote for 25MT of Battery-Grade Lithium Carbonate. Can you supply to our Tirupati plant by Q3 2026? Please share COA and pricing.', status: 'UNANSWERED' },
    { customerName: 'Dr. Suresh Patel (IIT Bombay)', source: 'EMAIL', message: 'Our lab needs 500kg of high-purity Cobalt Sulphate for cathode research. Is sample quantity available? We have DSIR funding.', status: 'REPLIED', reply: 'Dear Dr. Patel, Thank you for your interest. We can supply 500kg CoSO₄ at research-grade purity. Our team will send the COA and pricing shortly. — MiniMines BD Team' },
    { customerName: 'Sarah Jenkins (Tesla Procurement)', source: 'LINKEDIN', message: 'Hello MiniMines team, Tesla is evaluating Indian suppliers for recycled battery materials. Can we schedule a call to discuss your HHM process and volumes?', status: 'UNANSWERED' },
    { customerName: 'Ankit Verma (EV startup)', source: 'WEBSITE', message: 'Hi, we are building an EV 2-wheeler and need NMC 811 precursor materials. What is your monthly capacity for NiSO₄ and MnSO₄?', status: 'REPLIED', reply: 'Hi Ankit, Our current NiSO₄ capacity is 15MT/month and MnSO₄ is 20MT/month. Happy to discuss your requirements. Please share your specs and we will prepare a quote.' },
    { customerName: 'Govt. of Karnataka EPR Dept', source: 'PHONE', message: 'Following up on the MoU signed with Karnataka government. Need updated capacity plan and timeline for the critical minerals refining complex.', status: 'UNANSWERED' },
  ];
  for (const e of enquiries) { await post('enquiries', e); await delay(1200); }

  // ═══════════════════════════════════════════════════════════════
  // 6. BD OPPORTUNITIES — Pipeline deals
  // ═══════════════════════════════════════════════════════════════
  console.log('🎯 Seeding BD Opportunities...');
  const bdOpps = [
    { name: 'Amara Raja — Annual Li₂CO₃ Supply', companyName: 'Amara Raja Energy & Mobility', dealValue: 2400000, stage: 'NEGOTIATION', requirements: '100MT/year Battery-Grade Li₂CO₃. Need 99.5%+ purity, COA per lot. Quarterly deliveries to Tirupati plant.' },
    { name: 'Tata Chemicals — CoSO₄ Partnership', companyName: 'Tata Chemicals Ltd', dealValue: 1800000, stage: 'REQUIREMENTS', requirements: '60MT/year CoSO₄. Evaluating MiniMines HHM-processed material vs Chinese imports. Need trial lot first.' },
    { name: 'Log9 — Graphite Powder Supply', companyName: 'Log9 Materials', dealValue: 450000, stage: 'WON', requirements: '30MT/year recycled graphite powder for aluminium-ion batteries. Contract signed Q2 2026.' },
    { name: 'Exide — NMC Precursors Bundle', companyName: 'Exide Industries Ltd', dealValue: 5200000, stage: 'NEGOTIATION', requirements: 'Complete NMC precursor bundle: NiSO₄ 80MT + CoSO₄ 40MT + MnSO₄ 40MT annually. Price benchmarked to LME.' },
    { name: 'Hindalco — Copper Cathode Trial', companyName: 'Hindalco Industries', dealValue: 800000, stage: 'REQUIREMENTS', requirements: '10MT trial order of recycled copper cathode. Need LME Grade A certification. If quality passes, 50MT/year contract.' },
    { name: 'UNIDO — Phase 2 Supply', companyName: 'UNIDO', dealValue: 320000, stage: 'WON', requirements: 'Extension of Phase 1 commercial order. 5MT mixed battery-grade salts for developing nations program.' },
  ];
  for (const o of bdOpps) { await post('bdOpportunities', o); await delay(1200); }

  // ═══════════════════════════════════════════════════════════════
  // 7. CONTRACTS — Active supply agreements
  // ═══════════════════════════════════════════════════════════════
  console.log('📄 Seeding Contracts...');
  const contracts = [
    { name: 'ARBL-MM-2026-LI — Amara Raja Lithium Supply', startDate: '2026-04-01T00:00:00Z', endDate: '2027-03-31T23:59:59Z', totalQuantity: 100, lmeFormula: 'LME Lithium 3M Avg + $850/MT premium', status: 'ACTIVE' },
    { name: 'LOG9-MM-2026-GP — Log9 Graphite Annual', startDate: '2026-06-01T00:00:00Z', endDate: '2027-05-31T23:59:59Z', totalQuantity: 30, lmeFormula: 'Fixed ₹2,85,000/MT (CIF Bangalore)', status: 'ACTIVE' },
    { name: 'UNIDO-MM-2026-PH2 — UNIDO Phase 2', startDate: '2026-01-15T00:00:00Z', endDate: '2026-12-31T23:59:59Z', totalQuantity: 5, lmeFormula: 'Fixed $12,500/MT (FOB Bangalore)', status: 'ACTIVE' },
  ];
  const contractIds = [];
  for (const c of contracts) {
    const res = await post('contracts', c);
    if (res) contractIds.push(res.contracts ? res.contracts.id : (res.id || null));
    await delay(1200);
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. SALES ORDERS — Confirmed orders
  // ═══════════════════════════════════════════════════════════════
  console.log('📋 Seeding Sales Orders...');
  const salesOrders = [
    { name: 'ARBL-SO-2026-Q2 — Amara Raja Q2 Delivery', orderNumber: 'SO-2026-0042', orderDate: '2026-06-15T00:00:00Z', quantity: 25, contractId: contractIds[0] || '', fulfillmentStatus: 'IN_PROGRESS' },
    { name: 'LOG9-SO-2026-01 — Log9 Jul Delivery', orderNumber: 'SO-2026-0045', orderDate: '2026-07-01T00:00:00Z', quantity: 8, contractId: contractIds[1] || '', fulfillmentStatus: 'PENDING' },
    { name: 'UNIDO-SO-2026-02 — UNIDO Batch 2', orderNumber: 'SO-2026-0039', orderDate: '2026-05-20T00:00:00Z', quantity: 2, contractId: contractIds[2] || '', fulfillmentStatus: 'SHIPPED' },
    { name: 'ARBL-SO-2026-Q1 — Amara Raja Q1 (Complete)', orderNumber: 'SO-2026-0031', orderDate: '2026-03-10T00:00:00Z', quantity: 25, contractId: contractIds[0] || '', fulfillmentStatus: 'SHIPPED' },
  ];
  for (const so of salesOrders) { await post('salesOrders', so); await delay(1200); }

  // ═══════════════════════════════════════════════════════════════
  // 9. EXPORT SHIPMENTS — Logistics tracking
  // ═══════════════════════════════════════════════════════════════
  console.log('🚢 Seeding Export Shipments...');
  const shipments = [
    { name: 'SHP-2026-018 — UNIDO Geneva', vesselName: 'MSC Floriana', containerNumber: 'MSCU-7234891', shipmentDate: '2026-07-10T00:00:00Z', salesOrderId: '', qaStatus: 'PASSED', documentationStatus: 'READY', transitExport: 'IN_TRANSIT' },
    { name: 'SHP-2026-019 — Amara Raja Q2', vesselName: 'Maersk Seletar', containerNumber: 'MSKU-4512678', shipmentDate: '2026-07-18T00:00:00Z', salesOrderId: '', qaStatus: 'PASSED', documentationStatus: 'READY', transitExport: 'CUSTOMS' },
    { name: 'SHP-2026-020 — Log9 Bangalore', vesselName: 'Road Freight (Bengaluru)', containerNumber: 'TRK-KA51-9876', shipmentDate: '2026-07-22T00:00:00Z', salesOrderId: '', qaStatus: 'PENDING', documentationStatus: 'INCOMPLETE', transitExport: 'DOCUMENTATION' },
  ];
  const shipmentIds = [];
  for (const s of shipments) {
    const res = await post('exportShipments', s);
    if (res) shipmentIds.push(res.exportShipments ? res.exportShipments.id : (res.id || null));
    await delay(1200);
  }

  // ═══════════════════════════════════════════════════════════════
  // 10. EXPORT DOCUMENTS — Compliance docs for shipments
  // ═══════════════════════════════════════════════════════════════
  console.log('📎 Seeding Export Documents...');
  const exportDocs = [
    { documentName: 'EVD — UNIDO Geneva Shipment', documentType: 'EVD', exportShipmentId: shipmentIds[0] || '', status: 'SUBMITTED', targetDate: '2026-07-08T00:00:00Z' },
    { documentName: 'FEMA Declaration — UNIDO PH2', documentType: 'FEMA', exportShipmentId: shipmentIds[0] || '', status: 'SUBMITTED', targetDate: '2026-07-08T00:00:00Z' },
    { documentName: 'Shipping Bill — UNIDO Geneva', documentType: 'SHIPPING_BILL', exportShipmentId: shipmentIds[0] || '', status: 'PREPARED', targetDate: '2026-07-09T00:00:00Z' },
    { documentName: 'HSN Declaration — Amara Raja Q2', documentType: 'HSN', exportShipmentId: shipmentIds[1] || '', status: 'PREPARED', targetDate: '2026-07-16T00:00:00Z' },
    { documentName: 'E-Way Bill — Log9 Bangalore', documentType: 'E_WAY_BILL', exportShipmentId: shipmentIds[2] || '', status: 'PENDING', targetDate: '2026-07-23T00:00:00Z' },
    { documentName: 'Packing Note — Log9 Graphite', documentType: 'PACKING_NOTE', exportShipmentId: shipmentIds[2] || '', status: 'PENDING', targetDate: '2026-07-23T00:00:00Z' },
  ];
  for (const d of exportDocs) { await post('exportDocuments', d); await delay(1200); }

  // ═══════════════════════════════════════════════════════════════
  // 11. LME TRACKERS — Metal price feeds
  // ═══════════════════════════════════════════════════════════════
  console.log('📈 Seeding LME Trackers...');
  const lme = [
    { name: 'Aluminum — Jul 23', metalType: 'AL', rateDate: '2026-07-23T00:00:00Z', rateUSD: 2487, source: 'LME Official' },
    { name: 'Copper — Jul 23', metalType: 'CU', rateDate: '2026-07-23T00:00:00Z', rateUSD: 9342, source: 'LME Official' },
    { name: 'Cobalt — Jul 23', metalType: 'CO', rateDate: '2026-07-23T00:00:00Z', rateUSD: 33750, source: 'LME Official' },
    { name: 'Lithium — Jul 23', metalType: 'LI', rateDate: '2026-07-23T00:00:00Z', rateUSD: 14200, source: 'Fastmarkets' },
    { name: 'Aluminum — Jul 22', metalType: 'AL', rateDate: '2026-07-22T00:00:00Z', rateUSD: 2465, source: 'LME Official' },
    { name: 'Copper — Jul 22', metalType: 'CU', rateDate: '2026-07-22T00:00:00Z', rateUSD: 9285, source: 'LME Official' },
    { name: 'Cobalt — Jul 22', metalType: 'CO', rateDate: '2026-07-22T00:00:00Z', rateUSD: 33500, source: 'LME Official' },
    { name: 'Lithium — Jul 22', metalType: 'LI', rateDate: '2026-07-22T00:00:00Z', rateUSD: 14050, source: 'Fastmarkets' },
  ];
  for (const l of lme) { await post('lMETrackers', l); await delay(1200); }

  // ═══════════════════════════════════════════════════════════════
  // 12. DEPARTMENTS
  // ═══════════════════════════════════════════════════════════════
  console.log('🏛️ Seeding Departments...');
  await post('departments', { name: 'Sales' }); await delay(1200);
  await post('departments', { name: 'Business Development' }); await delay(1200);

  // ═══════════════════════════════════════════════════════════════
  // 13. STANDARD OPPORTUNITIES — Update existing BD Pipeline opps
  // ═══════════════════════════════════════════════════════════════
  console.log('🔗 Updating standard Opportunity pipeline links...');
  // Link existing opportunities to companies
  if (companyIds[0]) {
    // Link "aka batteries" opportunity to Amara Raja
    const oppsResp = await fetch(`${API}/opportunities?limit=50`, {
      headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    });
    const oppsData = await oppsResp.json();
    const opps = oppsData?.data?.opportunities || [];
    for (const opp of opps) {
      if (opp.companyId) continue; // skip already linked
      // Link first unlinked opp to a company
      const targetCompany = companyIds[Math.floor(Math.random() * companyIds.length)];
      if (targetCompany) {
        await fetch(`${API}/opportunities/${opp.id}`, {
          method: 'PATCH',
          headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyId: targetCompany }),
        });
        await delay(1200);
      }
    }
  }

  console.log('\n✅ Demo data seeding complete!\n');
  console.log('Summary:');
  console.log('  📦 8 Products (battery materials & metals catalog)');
  console.log('  🏢 5 Companies (real Indian battery/metals clients)');
  console.log('  👤 6 People (contacts at client companies)');
  console.log('  🎯 8 Leads (assigned across Associate, Manager, HOD)');
  console.log('  💬 5 Enquiries (mix of answered & unanswered)');
  console.log('  🎯 6 BD Opportunities (various pipeline stages)');
  console.log('  📄 3 Contracts (active supply agreements)');
  console.log('  📋 4 Sales Orders (different fulfillment stages)');
  console.log('  🚢 3 Export Shipments (documentation → customs → in transit)');
  console.log('  📎 6 Export Documents (EVD, FEMA, HSN, etc.)');
  console.log('  📈 8 LME Tracker entries (metal price feeds)');
  console.log('  🏛️ 2 Departments (Sales, BD)');
  console.log('\n🔗 Module Interconnections:');
  console.log('  Lead → BD Opportunity → Sales Order → Contract');
  console.log('  Sales Order → Export Shipment → Export Documents');
  console.log('  Products ↔ Quotations ↔ Sales Orders');
  console.log('  LME Tracker → Contract Pricing Formula');
  console.log('  Company → People → Leads → Opportunities');
}

seed().catch(console.error);
