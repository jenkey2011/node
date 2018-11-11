const http = require('http')
const querystring = require('querystring')

http.createServer((req, res) => {
  let qs = ''
  if (req.url.indexOf('?') === -1) {
    
  } else {
    let url = req.url.split('?')[1]
    console.log(url)
    qs = querystring.parse(url)
    console.log(qs)
  }
  res.write(JSON.stringify(qs))
  res.end()
}).listen('8080')