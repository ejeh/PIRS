var express               = require('express'),
    bodyParser            = require('body-parser'),
    logger                = require('morgan'),
    mongoose              = require('mongoose'),
    User                  = require('./model/user.js'),
    passport              = require('passport'),
    passportLocalMongoose = require('passport-local-mongoose'),
    LocalStrategy         = require('passport-local').Strategy;
 var expressValidator      = require('express-validator');
 
 
function route(app){
   var options = {
        useMongoClient: true,
        socketTimeoutMS : 0,
        keepAlive: true,
        reconnectTries: 30
    };
    mongoose.connect("mongodb://localhost/user_auth", options);
    // db = mongoose.connection;
    
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(require('express-session')({
    secret: "Guy",
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
}

module.exports.route = route;