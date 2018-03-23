const https = require('https');
const fs = require('fs');
const path = require('path');
const http = require('http');

const options = {
    key: fs.readFileSync(path.join(__dirname,`./faceunity_v7.key`)),
    cert: fs.readFileSync(path.join(__dirname,'./faceunity_v7.crt')),
    ca:[
        fs.readFileSync(path.join(__dirname,'./drm_server.crt'))
    ],
    ecdhCurve:'prime256v1',
    dhparam:fs.readFileSync(path.join(__dirname,'./dhparam.pem')),
    secureProtocol:'TLSv1_2_method',
    requestCert:true,
    rejectUnauthorized:true
};

var sd = https.createServer(options, (req, res) => {
    console.log('12123');


    var sd = http.get({
        hostname: 'localhost',
        port: 8002,
        method: 'POST',
        path: '/?asdasd=1',
    });

    res.writeHead(200);
    res.end('hello world\n');
}).listen(8000);
console.log('1111');
sd.on('error',function (err) {
    console.log(err)
});

sd.on('conncet',function (err) {
    console.log(err)
});

