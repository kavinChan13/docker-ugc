var http = require('http');

function urlParse(url){
    // var url = url;
    var obj = {};
    var reg = /[?&][^?&]+=[^?&]+/g;
    var arr = url.match(reg);

    if (arr) {
        arr.forEach(function (item) {
            var tempArr = item.substring(1).split('=');
            var key = decodeURIComponent(tempArr[0]);
            var val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
    }
    if(Object.keys(obj).length > 0){
        return obj;
    }
}

var connect = http.createServer(function (req, res) {
    var saa = urlParse(req.url);
    console.log(saa);
    res.writeHead(200);

    res.end('hello world\n');
}).listen(8001);

