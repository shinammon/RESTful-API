const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();
const mysql = require("mysql");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extend: true }));

app.use(
  session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: false,
  })
);

const conn = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  database: "food_crossroads",
});

conn.connect((error) => {
  if (error) {
    console.log(JSON.stringify(error));
    return;
  } else {
    console.log("connect success");
  }
});

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", (req, res) => {
  console.log(req.session);
  req.session.isAuth = true;
  console.log(req.session.id);
  res.send("Connect Success");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await conn.query("SELECT * FROM member WHERE user_email = ?", [
    req.body.user_email,
  ]);

  if (!user) {
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.user_pwd);

  if (!isMatch) {
    return res.redirect("/login");
  }

  req.session.isAuth = true;
  res.redirect("/dashboard");
});

// app.get("/register", (req, res) => {
//   res.render("register");
// });

// app.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;
//   let user = await conn.findOne({ email });

//   if (user) {
//     return res.redirect("/register");
//   }

//   const hashedPsw = await bcrypt.hash(password, 12);
//   user = new UserModal({
//     username,
//     email,
//     password: hashedPsw,
//   });

//   await user.save();
//   res.redirect("/login");
// });

app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(3000, console.log("Server Running"));
