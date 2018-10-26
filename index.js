const http = require('http')
const fs = require('fs')

const web = './www'

http.createServer(function (req, res) {
  let fileName = web + req.url
  fs.readFile(fileName, (err, data) => {
    if (err) {
      res.write('404')
    } else {
      res.write(data)
    }
    res.end()
  })
}).listen(8989, 'localhost', function () {

})