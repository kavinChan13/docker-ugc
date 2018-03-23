const fs = require('fs');
const file = '/tmp/test.txt';
const file2 = '/tmp/test2.txt';
fs.createWriteStream(file);
fs.createWriteStream(file2);
process.stdin.setEncoding('utf8');
var string = '';

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        string += chunk;
        fs.appendFile(file2, chunk, function (err) {
        })
    }
});
process.stdin.on('end', () => {
    console.log(string);
    fs.appendFile(file, string, function (err) {
        if (err) console.log('写文件操作失败');
        else console.log('写文件操作成功');
        string = '';
    })
});
// process.stdin.on('readable', () => {
//     let chunk = process.stdin.read();
//     if(typeof chunk === 'string'){
//         chunk = chunk.slice(0,-2);
//         // process.stdout.write(`stringLength:${chunk.length}\n`);
//         string += chunk
//     }
//     if(chunk === ''){
//         process.stdin.emit('end');
//         return
//     }
//     if (chunk !== null) {
//         // process.stdout.write(`data: ${chunk}\n`);
//         string += chunk;
//     }
// });
//
// process.stdin.on('end', () => {
//     fs.appendFile(file,string,function (err) {
//         if(err) console.log('写文件操作失败');
//         else console.log(string);
//         string = '';
//     })
// });

// process.stdin.on('readable', () => {
//     const chunk = process.stdin.read();
//     if (chunk !== null) {
//         // console.log(chunk.toString() + '');
//         // fs.appendFile(file,chunk,function (err) {
//         //     if(err) console.log('写文件操作失败');
//         //     else console.log('写文件操作成功');
//         //     string = '';
//         // })
//         string += chunk;
//     }
// });