// 以 Express 建立 Web 伺服器
var express = require("express");
var app = express();

// 以 body-parser 模組協助 Express 解析表單與JSON資料
var bodyParser = require('body-parser');
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: false}) );

// Web 伺服器的靜態檔案置於 public 資料夾
app.use( express.static( "public" ) );

// 以 express-session 管理狀態資訊
var session = require('express-session');
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true
}));

// 指定 esj 為 Express 的畫面處理引擎
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/view');

// 一切就緒，開始接受用戶端連線
app.listen(3000);
console.log("Web伺服器就緒，開始接受用戶端連線.");
console.log("「Ctrl + C」可結束伺服器程式.");

var mysql = require("mysql");
var conn = mysql.createConnection({
    user:'root',
    password:'root',
    database:'labdb1',
    host:'localhost',
    port: 3306
})

conn.connect(function(err){
    if(err){
        console.log(JSON.stringify(err));
        return;
    }
})

app.get("/home/news",function(req,res){
    conn.query("select * from news","",
    function(err,rows){
        var jsonstring = JSON.stringify(rows);
        res.send(jsonstring);
        //console.log(rows);
        // if(err){
        //     console.log(JSON.stringify(err));
        //     return;
        // }
        // res.send(JSON.stringify(rows));
    });
})

app.post("/home/news",function(req,res){
    //console.log(req.body); 
    conn.query("INSERT INTO news (title,ymd) VALUES (?,?)",
        [ req.body.title, req.body.ymd],
        function(err,rows){
            //console.log(rows);
            res.send("row inserted")
        }
    );
    
})

app.put("/home/news",function(req,res){
    //console.log(req.body);
    conn.query("UPDATE news set title = ? , ymd = ? WHERE newsId = ? ",
    [req.body.title, req.body.ymd, req.body.newsId],
    function(err,rows){
        //console.log(rows);
        res.send("row updated");
    }
    );
})

app.delete("/home/news",function(req,res){
    console.log(req.body);
    conn.query("DELETE from news WHERE newsId = ?",
    [req.body.newsId],
    function(err,rows){
        res.send("row deleted");
    }
    )
})