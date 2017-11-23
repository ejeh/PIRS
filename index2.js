global.db           = require('./libs/db.js')();
const express       = require('express'),
validator           = require('express-validator'),
expressValidator    = require('express-validator'),
expressSession      = require('express-session'),
methodOverride      = require('method-override'),
cookieParser        = require('cookie-parser'),
bodyParser          = require('body-parser'),
compress            = require('compression'),
User                = require('./model/revenue.js'),
passport            = require('passport'),
passportLocalMongoose = require('passport-local-mongoose'),
LocalStrategy         = require('passport-local').Strategy,
flash                = require('connect-flash'),
logger              = require('morgan'),
mongoose            = require('mongoose'),
path                = require('path'),
// flash               = require('express-flash'),
async               = require('async'),
crypto              = require('crypto'),

api                 = express.Router();
             
             
             
 api.use(expressValidator());
             
             
             
 const  app = express();
 

  app.enabled('trust proxy');

// the view engine set-up

// after placing your favicon in /public
// app.use(favicon(path.join(__dirname "public", "favicon.io")));
  app.use(logger('dev'));
  app.use(compress());
  app.use(validator());
  app.use(methodOverride('X-HTTP-Method-Override'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(expressValidator());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(expressSession({secret:"max",  saveUninitialized:"false", resave:"false"}));
  app.use(flash())
  
  var router = require ('./controllers/router');
  
//   ===================================================================================


var options = {
        useMongoClient: true,
        socketTimeoutMS : 0,
        keepAlive: true,
        reconnectTries: 30
    };
    
    // const db = mongoose.connection;
    // mongoose.connect("mongodb://localhost/user_auth", options);
    
    

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(require('express-session')({
    secret: "paymentStep1",
    resave: false,
    saveUninitialized: false
}));


// app.enable('trust proxy');

app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
    

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//__________
//ROUTE
//______________

app.get('/', function (req, res) {
    res.render('home',{message: req.flash("info")});
});

app.get('/paymentStep1',isLogedIn, function (req, res) {   
    res.render('paymentStep1',  { flashes: req.flash('error')});
});

app.get('/paymentStep2', function (req, res) {   
    res.render('paymentStep2',  { flashes: req.flash('error')});
});

// AUTH ROUTE
// render registration form
app.get('/register', function (req, res) {
   res.render('register', { flashes: req.flash('error')});
});

//ROUTE FOR USER SIGN UP
app.post('/register', function(req, res){
req.sanitizeBody('firstname');
req.sanitizeBody('lastname');
req.checkBody('firstname', 'You must supply your firstname!').notEmpty();
req.checkBody('lastname', 'You must supply a lastname!').notEmpty();
req.checkBody('username', 'Please enter a phone number!').notEmpty().isLength({max: 11});
req.checkBody('tin', 'please enter a tin number!').notEmpty();
req.checkBody('email', 'The email you have entered is not valid!').isEmail();
req.sanitizeBody('email').normalizeEmail({
 remove_dots: false,
 remove_extentions: false,
 gmail_remove_subaddress: false

});
req.checkBody('password', 'Password cannot be less than six characters!').notEmpty().isLength({min: 6});
req.checkBody('password-confirm', 'Confirm Password cannot be blank!').notEmpty();
req.checkBody('password-confirm', 'Opps, your password does not match!').equals(req.body.password);

var errors = req.validationErrors();
if(errors){
    req.flash('error', errors.map(err => err.msg));
    res.render('register', { flashes: req.flash('error')});
    return;
}
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.tin,
    req.body.username,
    req.body.password;
    User.register(new User({
            firstname:req.body.firstname, 
            lastname: req.body.lastname,
            email:    req.body.email,
            username: req.body.username,
            tin:      req.body.tin,
        }), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register', { flashes: req.flash('error')}); 
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect("/paymentStep1");
      
        });
    });
});

//LOGIN ROUTE
//render login form
app.get('/login', function(req, res){
    res.render('login',{flashes: req.flash("error")});
});

// Login logic
// middleware
app.post('/login',passport.authenticate("local", {
    successRedirect: "/paymentStep1",
    failureRedirect: "/login",
    failureFlash:     "Phone number or password is incorrect",
    successFlash: "You successfully logged in"
})), 
// function(err, res){
//      console.log("hello");
// });

/********************************
*  recover password             *         
*                               *
* ******************************/

app.get('/forgot_password', function(req, res) {
    res.render('forgot_password', {
      user: req.user
    });
  });
  
  app.post('/forgot_password', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot_password_password');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save((err) => {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'admin@nhubnigeria.com',
            pass: ''
          }
        });
        
        var mailOptions = {
          to: user.email,
          from: 'admin@nhubnigeria.com',
          subject: 'Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], (err) => {
      if (err) return next(err);
      res.redirect('/forgot_password');
    });
  });
  
  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot_password');
      }
      res.render('reset', {
        user: req.user
      });
    });
  });
  
  app.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
  
          user.save((err) => {
            req.logIn(user, (err) => {
              done(err, user);
            });
          });
        });
      },
      (user, done) => {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'admin@nhubnigeria.com',
            pass: ''
          }
        });
        
        var mailOptions = {
          to: user.email,
        from: 'admin@nhubnigeria.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, (err) => {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], (err) => {
      res.redirect('/');
    });
  });
  

app.get('/logout', function(req, res){
   req.logout();
   req.flash("info", "you successfully logged out")
   res.redirect("/")
});

function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("Error", "Oops You must login to do that!");
    res.redirect("/login");
}
// This allows you use the route funtions in the controller by exporting express to the route files using app.
// router.route(app);



// ====================================================================================



router.route(app);

var port = process.env.PORT || 8080;
var ip = process.env.IP || '127.0.0.1'; 
app.listen(port);

// app.get('/', function(req,res){
// 	res.send('Welcome');
// });



console.log("server started at " + ip + " and the port is " + port);
