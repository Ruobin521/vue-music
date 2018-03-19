    // 通过express导入路由
    const express = require('express')
    const axios = require('axios')
    const iconv = require('iconv-lite')
        // 引入json解析中间件
    const bodyParser = require('body-parser')

    const app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))


    app.get('/getDiscList', function(req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
            headers: {
                'referer': 'https://c.y.qq.com/',
                'host': 'c.y.qq.com'
            },
            params: req.query
        }).then((response) => {
            res.json(response.data)
        }).catch((e) => {
            console.log(e)
        })
    })

    app.post('/getVkey', function(req, res) {
        if (req.body) {
            // 能正确解析 json 格式的post参数
            getVkey(res, req.body.data)
        } else {
            // 不能正确解析json 格式的post参数
            let body = ''
            let jsonStr = ''
            req.on('data', function(chunk) {
                body += chunk // 读取参数流转化为字符串
            })
            req.on('end', function() {
                // 读取参数流结束后将转化的body字符串解析成 JSON 格式
                try {
                    jsonStr = JSON.parse(body)
                    getVkey(res, jsonStr)
                } catch (err) {
                    res.send('Error')
                }
            })
        }
    })

    function getVkey(res, data) {
        var url = `https://u.y.qq.com/cgi-bin/musicu.fcg?_=${getGuid()}`
            // var url = 'http://ustbhuangyi.com/music/api/getPurlUrl'
        axios.post(url, data, {}).then((response) => {
            res.json(response.data)
        }).catch((e) => {
            console.log(e)
        })
    }

    app.get('/lyric', function(req, res) {
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
            headers: {
                'referer': 'https://c.y.qq.com/',
                'host': 'c.y.qq.com'
            },
            params: req.query
        }).then((response) => {
            var ret = response.data
            if (typeof ret === 'string') {
                var reg = /^\w+\(({[^()]+})\)/
                var mathces = ret.match(reg)
                if (mathces) {
                    ret = JSON.parse(mathces[1])
                }
            }
            res.json(ret)
        }).catch((e) => {
            console.log(e)
        })
    })

    app.get('/getCdInfo', function(req, res) {
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
            headers: {
                referer: 'https://c.y.qq.com/',
                host: 'c.y.qq.com'
            },
            params: req.query
        }).then((response) => {
            var ret = response.data
            if (typeof ret === 'string') {
                var reg = /^\w+\(({.+})\)$/
                var matches = ret.match(reg)
                if (matches) {
                    ret = JSON.parse(matches[1])
                }
            }
            res.json(ret)
        }).catch((e) => {
            console.log(e)
        })
    })

    app.listen(40001, '127.0.0.1', () => {
        console.log('Vue-Music Server Start')
    })

    process.on('uncaughtException', (err) => {
        fs.writeSync(1, `捕获到异常：${err}\n`);
    });