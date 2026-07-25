const fetch = require('node-fetch');

async function deleteApp() {
  const url = 'https://api.twenty.com/rest/app-registrations/d793b556-1647-4017-8e49-bc1e85142f47';
  const apiKey = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgwNGZmMTA2LWM2YjQtNDUwZC04OThjLWYxZDUxMDc5MTNmMyJ9.eyJzdWIiOiI5NzljY2YxMy04ZDU2LTRjNjEtOTk5Ni0wMjE4MjY5MTI1ZGQiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiOTc5Y2NmMTMtOGQ1Ni00YzYxLTk5OTYtMDIxODI2OTEyNWRkIiwiaWF0IjoxNzg0OTY2NDAwLCJleHAiOjQ5Mzg1NjYzOTksImp0aSI6ImU1NzY4YTIyLWViODctNDc3MC04M2ZlLThhOGU3MjA4Y2VjMyJ9.3SnTbSOioIatsslSwMoWs1yVqGfL71Vw8QeyuPN8zUH9fVj9thl5Ohx3KyKngZG9_SPA0O0qJz2HZ4QAjaFzow';

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
