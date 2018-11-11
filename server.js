const express = require('express');
const static = require('express-static');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const consolidate = require('consolidate');
const mysql = require('mysql');
const moment = require('moment');

//连接池
const db = mysql.createPool({ host: 'localhost', user: 'root', password: '123456', database: 'blog' });

var server = express();
server.listen(8080);

//1.解析cookie
server.use(cookieParser('sdfasl43kjoifguokn4lkhoifo4k3'));

//2.使用session
var arr = [];
for (var i = 0; i < 100000; i++) {
  arr.push('keys_' + Math.random());
}
server.use(cookieSession({ name: 'zns_sess_id', keys: arr, maxAge: 20 * 3600 * 1000 }));

//3.post数据
server.use(bodyParser.urlencoded({ extended: false }));
server.use(multer({ dest: './www/upload' }).any());

//4.配置模板引擎
//输出什么东西
server.set('view engine', 'html');
//模板文件放在哪儿
server.set('views', './template');
//哪种模板引擎
server.engine('html', consolidate.ejs);

//接收用户请求
server.get('/', (req, res, next) => {
  //查询banner的东西
  db.query("SELECT * FROM banner_table", (err, data) => {
    if (err) {
      res.status(500).send('database error').end();
    } else {
      res.banners = data;
      next();
    }
  });
});

server.get('/', (req, res, next) => {
  db.query('SELECT ID,title,summary FROM article_table', (err, data) => {
    if (err) {
      res.status(500).send('database error').end();
    } else {
      res.articles = data;
      next();
    }
  })
});

server.get('/', (req, res) => {
  res.render('index.ejs', { banners: res.banners, articles: res.articles })
})

// 文章详情
server.get('/article', (req, res) => {
  let id = req.query.id;
  let act = req.query.act;
  if (!id) {
    res.status(404).send('文章不存在');
  }
  if (id) {
    // 点赞
    if (act === 'like') {
      db.query(`UPDATE article_table SET n_like = n_like+1 WHERE ID=${id}`, (err, data) => {
        if (err) {
          // res.status(500).send('数据库出错了');
        } else {
        }
      })
    }
    
    db.query(`SELECT * FROM article_table WHERE ID=${id}`, (err, data) => {
      if (err) {
        res.status(500).send('数据库出错了');
      } else {
        var article_data = data[0];
        article_data.post_time = moment.utc(data[0].post_time * 1000).format('YYYY-MM-DD HH:mm:ss');
        article_data.content = article_data.content.replace(/^/gm, '<p>').replace(/$/gm, '</p>')
        res.render('conText.ejs', { data: article_data});
      }
    })
  }

})

//4.static数据
server.use(static('./www'));
