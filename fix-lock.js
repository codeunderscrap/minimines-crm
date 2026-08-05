const fetch = require('node-fetch');

async function deleteApp() {
  const url = 'https://api.twenty.com/rest/app-registrations/d793b556-1647-4017-8e49-bc1e85142f47';
  const apiKey = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImJmOWVmNmViLTk5M2UtNDMyNi1iNzU1LTU0Zjk2ZmFkNmJhMCJ9.eyJzdWIiOiIyYjI0MDBhNy0xMTUxLTQ0YjMtYmU2Mi00MmIyZDg4ZjM4MmQiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiMmIyNDAwYTctMTE1MS00NGIzLWJlNjItNDJiMmQ4OGYzODJkIiwiaWF0IjoxNzg1OTA2OTQ3LCJleHAiOjQ5Mzk1MDY5NDYsImp0aSI6IjE0ZGMwN2RjLTFkYjYtNDA4Ny1hYjBmLTYyODZjZGRmZWZiZCJ9.V7DVW5gPycqPKvA9FjE6nclpS3EbUkFEY22f_xX22H6Be71zZd3HpilWY6KOAlTIQh6UXLHw-H4zZaFW0I_qWw';

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
