var express = require("express");
var app = express();
app.listen(3000);
app.use(express.static("public"));
app.use(express.urlencoded({extended: true})) //查看req.body

var mysql = require("mysql");
var conn = mysql.createConnection({
    user : "root",
    password: "root",
    host: "localhost",
    database: "tododb",
    port:3306
})

conn.connect(function(err){
    if(err){
        console.log(JSON.stringify(err));
        return;
    }
})

app.get("/todo/list",function(req,res){
    conn.query("SELECT * FROM todoTable",[],
    function(err,rows){
        res.send(JSON.stringify(rows));
    })
})

app.get("/todo/item/:id",function(req,res){
    conn.query("SELECT * FROM todoTable WHERE todoTableId =?",
    [req.params.id],
    function(err,rows){
        res.send(JSON.stringify(rows[0]));
    })
})

app.post("/todo/create",function(req,res){
    conn.query("INSERT INTO todoTable (title, isComplete) VALUES (? , ?) ", 
    [req.body.title , req.body.isComplete],
    function(err , rows){
        res.send(JSON.stringify(req.body));
    })
})

app.put("/todo/item",function(req,res){
    conn.query("UPDATE todoTable set title =? , isComplete = ? WHERE todoTableId = ?",
    [req.body.title, req.body.isComplete, req.body.todoTableId],
    function(err,rows){
        res.send(JSON.stringify(req.body));
    })
})

app.delete("/todo/delete/:id",function(req,res){
    conn.query("DELETE FROM todoTable WHERE todoTableId = ?",
    [req.params.id],
    function(err,rows){
        //res.send("ok");
        res.send("#" + req.params.id + "deleted");
    })
})
