const fs = require('fs');

const API_KEY = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';
const BASE_URL = 'https://minimines.twenty.com/rest';
const MANAGER_ID = '2b18c5a2-7bf7-4a35-ac66-7cd014f3fe9e'; // Hanuman S

async function run() {
  const res = await fetch(BASE_URL + '/bdOpportunities', { headers: { 'Authorization': API_KEY } });
  const data = await res.json();
  const opps = data.data.bdOpportunities;
  
  for (const opp of opps) {
    console.log('Updating ' + opp.name);
    await fetch(BASE_URL + '/bdOpportunities/' + opp.id, {
      method: 'PATCH',
      headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedManagerPrimaryId: MANAGER_ID })
    });
  }
  console.log('Done.');
}
run().catch(console.error);
