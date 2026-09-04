const fetch = require('node-fetch');

const API_KEY = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';
const BASE_URL = 'https://minimines.twenty.com/rest';

async function updateOpportunities() {
  // Fetch existing
  const res = await fetch(`${BASE_URL}/bdOpportunities`, {
    headers: { 'Authorization': API_KEY }
  });
  const data = await res.json();
  const opps = data.data.bdOpportunities;
  
  const associates = ['PRASHANTH', 'ABDUL_KHALID', 'RAKESH', 'VEDNANT'];
  
  for (let i = 0; i < opps.length; i++) {
    const opp = opps[i];
    const associate = associates[i % associates.length];
    
    console.log(`Updating opp ${opp.id} to associate ${associate}...`);
    const updateRes = await fetch(`${BASE_URL}/bdOpportunities/${opp.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ associateName: associate })
    });
    
    if (updateRes.ok) {
      console.log(`Successfully updated ${opp.name}`);
    } else {
      console.error(`Failed to update ${opp.name}`, await updateRes.text());
    }
  }
}

updateOpportunities().catch(console.error);
