'use strict'
var urlencode = require('urlencode');
var sha1 = require('sha1');
var request = require('request');
var co = require('co');
var fs = require('fs');
var util = require('util');
var sleep = require('sleep-promise');
var waitUntil = require('wait-until');
var replaceall = require("replaceall");

// var g_public_key = 'WymZcYffvhJkm1Q5b7Tblm9PYMnQMsy03TrFjPlDLwKCKX6x7b0teA==';
// var g_private_key = 'd0f2561d5a66b489f3ead08186e9989047d95379';
var g_public_key = 'rqsRams9w9gYJcT2X6bcCXSc16sIZUTZDxqH280uWnu7AE4RHVwM0w==';
var g_private_key = '83cd60e0768aff1889e977032f1eb6499ed3915a';

var g_result_file_name = './result.csv';
var g_index = -1;
var g_total = 20;
var g_frequence_time = 10000;
var g_wait_time = Array(g_total).fill(0);
var g_done_cnt = 0;
var g_token = undefined;

function GetRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};


function GetParamsString(params) {
    var para = [];
    if (!params) return undefined;
    for (var key in params) {
        if (!params[key]) {
            continue;
        }
        para.push([key, params[key]]);
    }
    para.sort(function (a, b) {
        var a0 = a[0];
        var b0 = b[0];
        if (a0 < b0) return -1;
        else if (a0 > b0) return 1;
        else return 0;
    });
    return para;
}

function SignParamsString(paras) {
    var sign_str = '';
    for (var i = 0; i < paras.length; i++) {
        sign_str = sign_str + paras[i][0] + paras[i][1];
    }
    sign_str = sign_str + g_private_key;
    return sha1(sign_str);
}

function GetAccessToken() {
    var params = {
        "Action": "GetAccessToken",
        "Region": "cn-bj2",
        "PublicKey": g_public_key
    };
    var para = GetParamsString(params);
    var sign = SignParamsString(para);

    var url = 'https://api.ucloud.cn/?';
    for (var i = 0; i < para.length; i++) {
        url = url + para[i][0] + '=' + urlencode(para[i][1]) + '&';
    }
    url = url + 'Signature=' + sign;
}

function GetToken() {
    return new Promise(function (resolve, reject) {
        var params = {
            "Action": "GetAccessToken",
            "Region": "cn-bj2",
            "PublicKey": g_public_key
        };
        var para = GetParamsString(params);
        var sign = SignParamsString(para);

        var get_token_url = 'https://api.ucloud.cn/?';
        for (var i = 0; i < para.length; i++) {
            get_token_url = get_token_url + para[i][0] + '=' + urlencode(para[i][1]) + '&';
        }
        get_token_url = get_token_url + 'Signature=' + sign;

        var my_options = {
            url: get_token_url,
            method: 'GET',
        };
        request.get(my_options, function (err, tmp_res, body) {
            if (!err && tmp_res.statusCode === 200) {
                //resolve(JSON.parse(body).message);
                var json = JSON.parse(body);
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

function Client(name) {
    co(function* () {
        if (g_token === undefined) {
            throw new Error('Undefined token');
        }
        /*
        //hcc
        var task_submit_url = 'http://api.ugc.service.ucloud.cn/?Action=SubmitTask&TaskName=test_' + name
        + '&Region=cn-bj2&ImageName=cn-bj2.ugchub.service.ucloud.cn/hccloud/hcc:ugc.1.17.20180211&OutputDir=/root/hc_svr/Result&OutputFileName=result_error.json&OutputFileName=result_result.bundle&AccessToken=' + g_token
        */

        /*
        //picasso
        var task_submit_url = 'http://api.ugc.service.ucloud.cn/?Action=SubmitTask&TaskName=test_' + name
        + '&Region=cn-bj2&ImageName=cn-bj2.ugchub.service.ucloud.cn/picasso/picasso:ugc.1.6.20180308&OutputDir=/root/server/result&OutputFileName=result_error.json&OutputFileName=result.bin&AccessToken=' + g_token
        */

        //emboss
        // var task_submit_url = 'http://api.ugc.service.ucloud.cn/?Action=SubmitTask&TaskName=test_' + name
        //     + '&Region=cn-bj2&ImageName=cn-bj2.ugchub.service.ucloud.cn/emboss/emboss:ugc.1.2.20180315&OutputDir=/root/server/Result&OutputFileName=test_error.json&OutputFileName=test_result.bundle&AccessToken=' + g_token;

        var task_submit_url = 'http://api.ugc.service.ucloud.cn/?Action=SubmitTask&TaskName=test_' + name
            + '&Region=cn-bj2&ImageName=cn-bj2.ugchub.service.ucloud.cn/ugctest2/stdin8:latest&OutputDir=/tmp&OutputFileName=test.txt&OutputFileName=test2.txt&AccessToken=' + g_token;
        console.log(task_submit_url);

        var my_options = {
            url: task_submit_url,
            method: 'POST',
            encoding: null,
            headers: {'content-type': 'application/octet-stream'},
            body: {
                // is_png: 1,
                // enable_hairseg: 1,
                // action: 'render_items',
                // name_tag: 'test',
                // img: fs.readFileSync('./test.png'),
                // depth: fs.readFileSync('./test.bin')
                string:'kavin ugc test string2 '
            },
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
                g_wait_time[name] = (diff[0] + diff[1] * 1e-9).toFixed(2);
                g_done_cnt++;
                console.log('usetime:' + (diff[0] + diff[1] * 1e-9).toFixed(2));
                // console.log("total: ", g_done_cnt, '  test_' + name + ' cost:', ((diff[0] + diff[1] * (1 / 1e9)) * 1000.0).toFixed(2) + 'ms');
            }else {
                // console.log(11111);
                console.log(`error : ${error}`);
            }
        });

    }).catch(function (err) {
        g_wait_time[name] = -1;
        g_done_cnt++;
        console.log(err.stack);
    });
}

var Test = function () {
    var a = g_index + 1;
    g_index++;
    if (g_index < g_total) {
        return sleep(g_frequence_time + GetRandomInt(0, 10)).then(Client(a)).then(Test);
    }
};

var Save = function (filename) {
    g_wait_time.sort((a, b) => {
        return a - b;
    });
    var str_to_save = replaceall(',', '\n', g_wait_time.toString());
    fs.appendFile(filename, str_to_save, function (err) {
        if (err) throw err;
    });
};

co(function* () {
    g_token = yield GetToken();
    console.log(g_token);
    // console.log(123123123);
    // Test();
    Client(g_index + 445);
}).catch(function (err) {
    console.log(err.stack);
});


waitUntil()
    .interval(2000)
    .times(Infinity)
    .condition(function () {
        return g_done_cnt >= g_total;
    })
    .done(function (result) {
        Save(g_result_file_name);
        util.log('all done');
    });
