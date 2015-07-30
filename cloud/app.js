var express = require('express');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');

var app = express();
 
// Global app configuration section
// Global app configuration section 
// Global app configuration section 
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine

//app.use(express.json()); // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(parseExpressHttpsRedirect());
app.use(express.bodyParser());

app.use(express.cookieParser('YOUR_SIGNING_SECRET_1'));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));
/*
app.get('/lol', function(req, res) {
  res.render('lol.ejs', { message: 'Congrats, you just set up your app!' });
});
*/

app.get('/app', function(req, res) {
  console.log(req.params)
  console.log(req.user)
  var currentUser = Parse.User.current();

  if (currentUser) {
    res.render('app.ejs', {message: "app"})
  } else {
    //res.render('login.ejs', {message: "app"})
    res.redirect('/login')
  }
})

//TODO - add stripe
app.get('/login', function(res, res) {
  var currentUser = Parse.User.current();
  if (currentUser) {
    res.redirect("/")
  } else {
    res.render('login.ejs', {message: "app"})
  }
})

app.get('/signup', function(res, res) {
  var currentUser = Parse.User.current();
  if (currentUser) {
    res.redirect("/")
  } else {
    res.render('signup.ejs', {message: "app"})
  }
})

app.get('/', function(res, res) {
  var currentUser = Parse.User.current();
  if (currentUser) {
    res.render('app.ejs', {message: "app"})
  } else {
    res.render('clearspark.ejs', {message: "app"})
  }
})

app.get('/logout', function(req,res){
  // TODO - how to logout?
  Parse.User.logOut()
})

app.post('/login', function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   Parse.User.logIn(username, password, {
      success: function(user) {
        console.log("successful login")
        console.log(user)
        // TODO return user
        res.redirect('/');
        //res.send(user)
      },
      error: function(user, error) {
        console.log("error login")
        res.send(error)
        //res.redirect('/login');
      }
   });
});


app.get('/test', function(req, res) {
  //res.render('public/index.html', { message: 'Congrats, you just set up your app!' });
  //res.sendFile('public/index.html');
  res.render('app.ejs', {message: "app"})
  //} else {
});

app.get('/google_redirect', function(req, res) {
  res.render('google_redirect.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/windows_redirect', function(req, res) {
  res.render('windows_redirect.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/calendar_redirect', function(req, res) {
  res.render('calendar_redirect.ejs', { message: 'Congrats, you just set up your app!' });
});

app.get('/salesforce_redirect', function(req, res) {
  res.render('salesforce_redirect.ejs', { message: 'Congrats, you just set up your app!' });
});
 
// This line is required to make Express respond to http requests.
app.listen()
