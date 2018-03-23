const https = require('https');
const fs = require('fs');
const path = require('path');
const urlencode = require('urlencode');
const sha1 = require('sha1');
const request = require('request');
const co = require('co');
// const util = require('util');
// const sleep = require('sleep-promise');
// const waitUntil = require('wait-until');
// const replaceall = require("replaceall");

// let g_public_key = 'WymZcYffvhJkm1Q5b7Tblm9PYMnQMsy03TrFjPlDLwKCKX6x7b0teA==';
// let g_private_key = 'd0f2561d5a66b489f3ead08186e9989047d95379';
const g_public_key = 'rqsRams9w9gYJcT2X6bcCXSc16sIZUTZDxqH280uWnu7AE4RHVwM0w==';
const g_private_key = '83cd60e0768aff1889e977032f1eb6499ed3915a';

let g_index = -1;
let g_token = undefined;
// const g_result_file_name = './result.csv';
// const g_frequence_time = 10000;
// let g_total = 20;
// let g_wait_time = Array(g_total).fill(0);
// let g_done_cnt = 0;

// function GetRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min)) + min;
// }


function GetParamsString(params) {
    let para = [];
    if (!params) return;
    for (let key in params) {
        if (!params[key]) {
            continue;
        }
        para.push([key, params[key]]);
    }
    para.sort(function (a, b) {
        let a0 = a[0];
        let b0 = b[0];
        if (a0 < b0) return -1;
        else if (a0 > b0) return 1;
        else return 0;
    });
    return para;
}

function SignParamsString(paras) {
    let sign_str = '';
    for (let i = 0; i < paras.length; i++) {
        sign_str = sign_str + paras[i][0] + paras[i][1];
    }
    sign_str = sign_str + g_private_key;
    return sha1(sign_str);
}

function GetToken() {
    return new Promise(function (resolve, reject) {
        let params = {
            "Action": "GetAccessToken",
            "Region": "cn-bj2",
            "PublicKey": g_public_key
        };
        let para = GetParamsString(params);
        let sign = SignParamsString(para);

        let get_token_url = 'https://api.ucloud.cn/?';
        for (let i = 0; i < para.length; i++) {
            get_token_url = get_token_url + para[i][0] + '=' + urlencode(para[i][1]) + '&';
        }
        get_token_url = get_token_url + 'Signature=' + sign;

        let my_options = {
            url: get_token_url,
            method: 'GET',
        };
        request.get(my_options, function (err, tmp_res, body) {
            if (!err && tmp_res.statusCode === 200) {
                //resolve(JSON.parse(body).message);
                let json = JSON.parse(body);
                if (json.Message === '成功') {
                    resolve(json.AccessToken);
                }
                else if (json.Message !== undefined) {
                    reject(new Error(json.Message));
                }
                else {
                    reject(new Error('Uknown Error'));
                }
            } else {
                reject(err || new Error(body));
            }
        });
    });
}

function Client(name,body,res) {
    co(function* () {
        if (g_token === undefined) {
            throw new Error('Undefined token');
        }
        if(!body){
            throw new Error('Undefined body');
        }
        if(!res){
            throw new Error('Undefined res');
        }
        let task_submit_url = 'http://api.ugc.service.ucloud.cn/?Action=SubmitTask&TaskName=test_' + name
            + '&Region=cn-bj2&ImageName=cn-bj2.ugchub.service.ucloud.cn/ugctest2/stdin8:latest&OutputDir=/tmp&OutputFileName=test.txt&OutputFileName=test2.txt&AccessToken=' + g_token;

        console.log(task_submit_url);

        let my_options = {
            url: task_submit_url,
            method: 'POST',
            encoding: null,
            headers: {'content-type': 'application/octet-stream'},
            body:body,
            // body: {
            //     // is_png: 1,
            //     // enable_hairseg: 1,
            //     // action: 'render_items',
            //     // name_tag: 'test',
            //     // img: fs.readFileSync('./test.png'),
            //     // depth: fs.readFileSync('./test.bin')
            //     string:'kavin ugc test string2 '
            // },
            json: true
        };

        let time_base = process.hrtime();
        console.log(1);
        request.post(my_options, function (error, response, body) {
            console.log(2);
            if (!error) {
                console.log(3);
                console.log(body.toString('utf-8'));
                fs.writeFileSync('./output_' + name + '.tar', body);
                let diff = process.hrtime(time_base);
                console.log('usetime:' + (diff[0] + diff[1] * 1e-9).toFixed(2));
                res(body);
            }else {
                console.log(`error : ${error}`);
                res(error);
            }
        });

    }).catch(function (err) {
        console.log(err.stack);
    });
}




const calculation =  co(function* (body,res) {
    g_token = yield GetToken();
    console.log(g_token);
    // Test();
    Client(g_index + Math.floor(Math.random()*1000),body,res);
}).catch(function (err) {
    console.log(err.stack);
});

// const Test = function () {
//     let a = g_index + 1;
//     g_index++;
//     if (g_index < g_total) {
//         return sleep(g_frequence_time + GetRandomInt(0, 10)).then(Client(a)).then(Test);
//     }
// };

// const Save = function (filename) {
//     g_wait_time.sort((a, b) => {
//         return a - b;
//     });
//     let str_to_save = replaceall(',', '\n', g_wait_time.toString());
//     fs.appendFile(filename, str_to_save, function (err) {
//         if (err) throw err;
//     });
// };

// waitUntil()
//     .interval(2000)
//     .times(Infinity)
//     .condition(function () {
//         return g_done_cnt >= g_total;
//     })
//     .done(function (result) {
//         Save(g_result_file_name);
//         util.log('all done');
//     });




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

const sd = https.createServer(options, (req, res) => {
    console.log('12123');
    res.writeHead(200);
    let body = req.body;
    calculation(body,res);
    // res.end('hello world\n');
}).listen(8000);
console.log('1111');
sd.on('error',function (err) {
    console.log(err)
});

sd.on('conncet',function (err) {
    console.log(err)
});