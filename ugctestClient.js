var http = require('http');

var postData = JSON.stringify({asd:'已无数据。'});
var pram = {
    hostname: 'localhost',
    port: 8002,
    method: 'POST',
    path: '/?asdasd=1',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    }
};
var connect = http.get(pram,function (res) {
    console.log(`状态码: ${res.statusCode}`);
    // console.log(`响应头: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`响应主体: ${chunk}`);
    });
    res.on('end', () => {
        console.log('响应中已无数据。');
    });
});

connect.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
});