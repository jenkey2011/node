const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const urlLib = require('url')

let user = {}

let server = http.createServer((req, res) => {
  // 解析数据
  let str = ''
  req.on('data', data => str += data)

  req.on('end', () => {
    let obj = urlLib.parse(req.url, true)

    const url = obj.pathname
    const get = obj.query
    const post = querystring.parse(str)

    if (url === '/user') {

    } else {
      let fileName = './www' + url
      fs.readFile(fileName, (err, data) => {
        if (err) {
          res.write(err)
        } else {
          res.write(data)
        }
        res.end()
      })
    }
  })
  res.write('hello word')
  res.end()
}).listen(8999)