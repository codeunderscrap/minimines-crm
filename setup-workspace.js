const fs = require('fs');
const path = require('path');
const os = require('os');

const twentyDir = path.join(os.homedir(), '.twenty');
if (!fs.existsSync(twentyDir)) {
  fs.mkdirSync(twentyDir, { recursive: true });
}

const configPath = path.join(twentyDir, 'config.json');
const config = {
  "version": 1,
  "remotes": {
    "production": {
      "apiUrl": "https://api.twenty.com",
      "apiKey": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU1OTAxLCJleHAiOjQ5Mzc4Njk1MDAsImp0aSI6IjM3Mjc1OTNkLWU2ZjAtNGI1Mi05ODU5LTQwYzE4NGNlYWZiYiJ9.zlpo0DtbG5PxxmFfWzib3BEmVh-WNHAcjbc0CH3TlH-27Qv24w5hJ7Z3xH3nD8Qdk8eJCWjstEQfYgBGB5eOVA"
    }
  },
  "defaultRemote": "production"
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('? Successfully created ~/.twenty/config.json with the new API key and production URL!');
