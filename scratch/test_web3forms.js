const https = require('https');

const data = JSON.stringify({
  access_key: 'fafa27d4-e5e6-46ee-92b0-3d1ec6834d67',
  name: 'Diagnostic Tester',
  email: 'test@example.com',
  message: 'Testing email delivery'
});

const options = {
  hostname: 'api.web3forms.com',
  port: 443,
  path: '/submit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', body);
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e);
});

req.write(data);
req.end();
