var fs = require('fs');
var https = require('https');
var path = require('path');

const options = {
    hostname: '127.0.0.1',
    port: 8000,
    path: '/',
    method: 'GET',
    key: fs.readFileSync('drm_server.key'),
    cert: fs.readFileSync('drm_server.crt'),
    ca:[
        fs.readFileSync(path.join(__dirname,'./faceunity_v7.crt'))
    ],
    // ecdhCurve:'prime256v1',
    // dhparam:fs.readFileSync(path.join(__dirname,'./dhparam.pem')),
    // requestCert:true,
    // rejectUnauthorized:true,
    // secureProtocol:'TLSv1_2_method',
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
    // ...
    console.log(res)
});

req.on('error',function (err) {
    console.log(err)
});
