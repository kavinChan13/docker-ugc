const https = require('https');
const fs = require('fs');

const options = {
    hostname: '127.0.0.1',
    port: 8000,
    path: '/',
    method: 'GET',
    key: fs.readFileSync('742136883@qq.com_key.txt'),
    cert: fs.readFileSync('742136883@qq.com_csr.txt'),
    agent: false
};

const req = https.request(options, (res) => {
    // ...

});