const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
const urlLib = require('url')

let users = {}

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
      switch (get.act) {
        case 'reg':
          // 检查用户名是否存在
          if (users[get.name]) {
            res.write('{"ok": false, "msg": "此用户已存在"}')
          } else {
            users[get.name] = get.password
            res.write('{"ok": true, "msg": "注册成功"}')
          }
          break
        case 'login':
          // 检查用户名是否存在 是否正确
          if (users[get.name] === undefined) {
            res.write('{"ok": false, "msg": "此用户不存在"}')
          } else if (users[get.name] === get.password) {
            res.write('{"ok": true, "msg": "登录成功"}')
          } else {
            res.write('{"ok": false, "msg": "用户名或密码不正确"}')
          }
          break
        default:
          res.write('{"ok": false, "msg": "未知的act"}')
          break
      }
      console.log(users)
      res.end()
    } else {
      let fileName = './www' + url
      fs.readFile(fileName, (err, data) => {
        if (err) {
          res.write('404')
        } else {
          res.write(data)
        }
        res.end()
      })
    }
  })
}).listen(8999, 'localhost', function () {

})