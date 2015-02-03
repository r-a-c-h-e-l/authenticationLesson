var express = require('express');
var session = require("express-session");
var bodyParser = require('body-parser');
var app = express();
var secret = require('./secret.json');

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: secret.password,
  resave: false,
  saveUninitialized: true
}));



app.get('/', function (req, res) {
 res.sendFile(__dirname + '/public/index.html');
});

app.post('/session', function (req, res) {
  console.log("hey");
 if ( req.body.password === secret.password ) {
   req.session.valid_user= true;
   console.log(req.session);
   res.redirect('/secret_page');
 }
 else {
   res.redirect('/');
 }
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
