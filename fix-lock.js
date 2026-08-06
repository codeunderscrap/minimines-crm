const fetch = require('node-fetch');

async function deleteApp() {
  const url = 'https://api.twenty.com/rest/app-registrations/d793b556-1647-4017-8e49-bc1e85142f47';
  const apiKey = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJiZTliODFjNy0yOTU1LTRkNDQtOWNmYy01YmQ3YTQ4ZWE1ZDAiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiYmU5YjgxYzctMjk1NS00ZDQ0LTljZmMtNWJkN2E0OGVhNWQwIiwiaWF0IjoxNzg2MDAwMjUwLCJleHAiOjQ5Mzk2MDAyNDksImp0aSI6ImQ2ZWZmZjU0LTYxY2MtNGZkZi04MjA5LTE3ZmUwN2IwNDVlYiJ9.tiA4nKtMNiRvf06rFWtCTj657uau7JWlA2fbV_qGIQU68U_Qr2E_dVJeazrhD5sNfVMDiOOLvRfS_LWEPDW5Eg';

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    }
  });

  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
}

deleteApp();
