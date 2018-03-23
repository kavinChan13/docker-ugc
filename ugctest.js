var http = require('http');


function doSomething(num) {
    return num;
}

http.createServer(function (req,res) {
    var pram = req.url;
    req.setEncoding('utf8');
    console.log(req.body);
    var result = doSomething(pram);
    console.log(123131);
    res.end('hello world\n' + result);
}).listen(8002);


