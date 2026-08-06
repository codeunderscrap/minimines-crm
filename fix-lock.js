const fetch = require('node-fetch');

async function deleteApp() {
  const url = 'https://api.twenty.com/rest/app-registrations/d793b556-1647-4017-8e49-bc1e85142f47';
  const apiKey = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJiZTliODFjNy0yOTU1LTRkNDQtOWNmYy01YmQ3YTQ4ZWE1ZDAiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiYmU5YjgxYzctMjk1NS00ZDQ0LTljZmMtNWJkN2E0OGVhNWQwIiwiaWF0IjoxNzg2MDAzNTcwLCJleHAiOjQ5Mzk1MTcxNjksImp0aSI6ImY2ZDJhYTRmLWU1ZGEtNDJiYS05NGY0LWRhODk2YWI2YmI5ZSJ9.xBds_qiKcR8OWNq7Y2H6DlNLPNpatMmhCatHQP8bvI83L74vDYo-M8LVdlmjJFzVuGNZLJ7lIv5a_8AOh__LNw';

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
