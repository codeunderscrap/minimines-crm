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
      "apiKey": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImJmOWVmNmViLTk5M2UtNDMyNi1iNzU1LTU0Zjk2ZmFkNmJhMCJ9.eyJzdWIiOiIyYjI0MDBhNy0xMTUxLTQ0YjMtYmU2Mi00MmIyZDg4ZjM4MmQiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiMmIyNDAwYTctMTE1MS00NGIzLWJlNjItNDJiMmQ4OGYzODJkIiwiaWF0IjoxNzg1OTA2OTQ3LCJleHAiOjQ5Mzk1MDY5NDYsImp0aSI6IjE0ZGMwN2RjLTFkYjYtNDA4Ny1hYjBmLTYyODZjZGRmZWZiZCJ9.V7DVW5gPycqPKvA9FjE6nclpS3EbUkFEY22f_xX22H6Be71zZd3HpilWY6KOAlTIQh6UXLHw-H4zZaFW0I_qWw"
    }
  },
  "defaultRemote": "production"
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('? Successfully created ~/.twenty/config.json with the new API key and production URL!');
