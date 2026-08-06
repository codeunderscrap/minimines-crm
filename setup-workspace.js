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
      "apiKey": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJiZTliODFjNy0yOTU1LTRkNDQtOWNmYy01YmQ3YTQ4ZWE1ZDAiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiYmU5YjgxYzctMjk1NS00ZDQ0LTljZmMtNWJkN2E0OGVhNWQwIiwiaWF0IjoxNzg2MDAwMjUwLCJleHAiOjQ5Mzk2MDAyNDksImp0aSI6ImQ2ZWZmZjU0LTYxY2MtNGZkZi04MjA5LTE3ZmUwN2IwNDVlYiJ9.tiA4nKtMNiRvf06rFWtCTj657uau7JWlA2fbV_qGIQU68U_Qr2E_dVJeazrhD5sNfVMDiOOLvRfS_LWEPDW5Eg"
    }
  },
  "defaultRemote": "production"
};

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('? Successfully created ~/.twenty/config.json with the new API key and production URL!');
