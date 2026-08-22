const API_URL = 'https://minimines.twenty.com/rest';
const API_HEADERS = {
  Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg',
  'Content-Type': 'application/json',
};

const TICKER_MAP = {
  'CU': 'HG=F',
  'AL': 'ALI=F',
  'FE': 'TIO=F',
};

async function fetchYahooPrice(ticker) {
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error('No result in Yahoo response');
  const meta = result.meta;
  return meta.regularMarketPrice;
}

async function syncPrices() {
  console.log('Starting LME price sync via raw Yahoo Finance API...');
  const today = new Date().toISOString();

  for (const [metalType, ticker] of Object.entries(TICKER_MAP)) {
    try {
      const rawPrice = await fetchYahooPrice(ticker);
      let price = parseFloat(rawPrice);
      
      if (metalType === 'CU') {
        price = price * 2204.62;
      }

      console.log(`${metalType} (${ticker}): $${price.toFixed(2)} USD/MT`);

      const res = await fetch(`${API_URL}/lMETrackers`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          name: `${metalType} Daily Sync - ${today.substring(0, 10)}`,
          metalType: metalType,
          rateDate: today,
          rateUSD: parseFloat(price.toFixed(2)),
          source: 'Yahoo Finance (Futures)',
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`Failed to save ${metalType} to CRM:`, err);
      } else {
        console.log(`Saved ${metalType} to CRM successfully.`);
      }

    } catch (e) {
      console.error(`Error syncing ${metalType}:`, e.message || e);
    }
  }
  
  console.log('LME sync complete.');
}

syncPrices();
