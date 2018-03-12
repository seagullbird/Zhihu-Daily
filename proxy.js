const http = require('http');
const request = require('request');

const hostname = '127.0.0.1';
const port = 8010;
const imgPort = 8011;

// 创建 API 代理服务
const apiServer = http.createServer((req, res) => {
    const url = 'http://news-at.zhihu.com/api/4' + req.url;
    const options = {
        url: url
    }

    function callback (error, response, body) {
        if (!error && response.statusCode === 200) {
            // 为中文显示设置编码类型
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            // 设置允许所有跨域
            res.setHeader('Access-Control-Allow-Origin', '*');
            // 返回代理后的内容
            res.end(body);
        }
    }
    request.get(options, callback);
});

apiServer.listen(port, hostname, () => {
    console.log(`接口代理运行在 http://${hostname}:${port}`);
})

// 创建图片代理服务
const imgServer = http.createServer((req, res) => {
    const url = req.url.split('/img/')[1];
    const options = {
        url: url,
        encoding: null
    }

    function callback (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.setHeader('Content-Type', response.headers['Content-Type']);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(body);
        }
    }
    request.get(options, callback); 
});

imgServer.listen(imgPort, hostname, () => {
    console.log(`图片代理运行在 http://${hostname}:${imgPort}`);
})
