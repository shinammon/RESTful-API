var express = require("express");
var app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

var es = require("express-session");
app.use(
  es({
    secret: "password",
    resave: true,
    saveUninitialized: true,
  })
);

app.listen(3000);

app.get("/", function (req, res) {
  res.redirect("/home/index");
});

app.get("/home/index", function (req, res) {
  var userID = req.session.userName || "Guest";
  res.render("index.ejs", { userName: userID });
});

app.get("/member/logout", function (req, res) {
  //req.session.userName = "Guest";

  delete req.session.userName;
  res.redirect("/home/index");
});

app.get("/member/login", function (req, res) {
  res.render("login.ejs", {});
});

app.post("/member/login", function (req, res) {
  if (req.body.txtID == "") {
    res.render("login.ejs", {});
    return;
  }
  var nextStep = req.query.returnUrl || "/home/index";
  req.session.userName = req.body.txtID;
  res.redirect(nextStep);
  // res.send("I got data: " + req.body.txtID);
});

app.get("/member/secret", function (req, res) {
  var userID = req.session.userName || "Guest";
  if (userID == "Guest") {
    res.redirect("/member/login?returnUrl=/member/secret");
  } else {
    res.render("secret.ejs", { userName: userID });
  }
});
