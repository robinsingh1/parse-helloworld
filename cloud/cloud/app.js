/*
app.post('/login', function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   Parse.User.logIn(username, password, {
      success: function(user) {
         res.redirect('/');
      },
      error: function(user, error) {
        res.redirect('/login');
      }
   });
});
*/

var express = require('express');
var app = express();
 
// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine

app.get('/', function(req, res) {
  res.render('index.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/pricing', function(req, res) {
  res.render('pricing.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/features', function(req, res) {
  res.render('features.ejs', { message: 'Congrats, you just set up your app!' });
});
 
app.get('/services', function(req, res) {
  res.render('services.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/google_redirect', function(req, res) {
  res.render('google_redirect.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/robin', function(req, res) {
  res.render('robin.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/clearspark', function(req, res) {
  res.render('clearspark.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/windows_redirect', function(req, res) {
  res.render('windows_redirect.ejs', { message: 'Congrats, you just set up your app!' });
});
// This line is required to make Express respond to http requests.
app.listen();
