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
      "apiKey": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgwNGZmMTA2LWM2YjQtNDUwZC04OThjLWYxZDUxMDc5MTNmMyJ9.eyJzdWIiOiI5NzljY2YxMy04ZDU2LTRjNjEtOTk5Ni0wMjE4MjY5MTI1ZGQiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiOTc5Y2NmMTMtOGQ1Ni00YzYxLTk5OTYtMDIxODI2OTEyNWRkIiwiaWF0IjoxNzg0OTY2NDAwLCJleHAiOjQ5Mzg1NjYzOTksImp0aSI6ImU1NzY4YTIyLWViODctNDc3MC04M2ZlLThhOGU3MjA4Y2VjMyJ9.3SnTbSOioIatsslSwMoWs1yVqGfL71Vw8QeyuPN8zUH9fVj9thl5Ohx3KyKngZG9_SPA0O0qJz2HZ4QAjaFzow"
    }
  },
  "defaultRemote": "production"
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('? Successfully created ~/.twenty/config.json with the new API key and production URL!');
