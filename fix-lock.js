const fetch = require('node-fetch');

async function deleteApp() {
  const url = 'https://api.twenty.com/rest/app-registrations/d793b556-1647-4017-8e49-bc1e85142f47';
  const apiKey = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ';

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': Bearer ,
      'Content-Type': 'application/json'
    }
  });

  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
}

deleteApp();
