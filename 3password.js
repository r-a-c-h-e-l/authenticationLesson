var express = require('express');
var session = require("express-session");
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("auth_exercise.db");

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: "cookie",
  resave: false,
  saveUninitialized: true
}));

app.get('/', function (req, res) {
 res.sendFile(__dirname + '/public/index.html');
});

app.post('/user', function(req,res) {
  var username = req.body.username;
  var password = req.body.password;
  var confirm = req.body.confirm;
  if (password != confirm) {
    res.redirect('/');
  } else {
    db.get("SELECT*FROM users WHERE username= ? AND password= ?", username, password, function(err,row) {
      if(err) {throw err;}
      if(row) {
        res.sendFile(__dirname + '/public/exist.html');
      } else {
        db.run("INSERT INTO users (username,password) VALUES(?,?)", username, password, function(err) {
          if(err){throw err;}
          req.session.valid_user= true;
          res.redirect('/secret_page');
        });
      }
    });
  }
});

app.post('/session', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  db.get("SELECT*FROM users WHERE username= ? AND password= ?", username, password, function(err,row) {
    if(err) {throw err;}
    if(row) {
      req.session.valid_user= true;
      res.redirect('/secret_page');
    } else {
      res.sendFile(__dirname + '/public/error.html');
    }
  });
});

app.get('/secret_page', function (req, res) {
  if (req.session.valid_user) {
    res.sendFile(__dirname + '/public/secret.html');
  } else {
    res.redirect('/');
  }
});

app.get('/secret_page2', function (req, res) {
  if (req.session.valid_user) {
    res.sendFile(__dirname + '/public/secret2.html');
  } else {
    res.redirect('/');
  }

});

app.listen(3000);
console.log("listening on port 3000");
