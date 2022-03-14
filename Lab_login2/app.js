var express = require("express");
var app = express();
var session = require("express-session");
app.use(
  session({
    secret: "mySecret",
    name: "user",
    saveUninitialized: false,
    resave: true,
  })
);

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.sessionID);
});

app.post("/login", (req, res) => {
  const users = [
    {
      firstName: "Tony",
      email: "tony@gmail.com",
      password: "tony123",
    },
    {
      firstName: "Steven",
      email: "Steven@gmail.com",
      password: "Steven123",
    },
  ];

  const { email, password } = req.body;
  if (email.trim() === "" || password.trim() === "") {
    return res.render("index", { alert: "Email or Password is incorrect" });
  }

  for (let user of users) {
    if (user.email === email && user.password === password) {
      req.session.user = user.firstName;
      return res.redirect("/welcome");
    }
  }

  return res.render("index", { alert: "Email or Password is incorrect" });
});

function auth(req, res, next) {
  if (req.session.user) {
    console.log("authenticated");
    next();
  } else {
    console.log("not authenticated");
    return res.redirect("/");
  }
}

app.get("/welcome", auth, (req, res) => {
  const userName = req.session.user;
  return res.render("welcome", { message: `welcome back, ${userName}!` });
});

app.get("/logout", auth, (req, res) => {
  req.session.destroy(() => {
    console.log("session destroyed");
  });
  res.render("index", { alert: "Yor are logged out" });
});

app.listen(3000);
