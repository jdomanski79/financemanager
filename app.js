'use strict';
const express = require('express');
const exphbs  = require('express-handlebars');
const morgan  = require('morgan');
const helmet  = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const routes = require('./routes');
const transactions= require('./routes/transactions');
const stats = require('./routes/stats');
const helpers = require('./lib/helpers');
const config = require('./config')


const app = express();



// DATABASE CONNECTION
//=======================

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(config.mongoURI);

const db = mongoose.connection;
//mongoose.set('debug', true);

db.on('error', console.error.bind(console, 'Database connection error!'));

db.on('connected', () => {
  console.log('Database connected.');  
})

app.use(session({
  secret: config.sessionSecret,
  cookie: {
    maxAge: 7*24*60*60*1000, //7 days
  },
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store : new MongoStore({mongooseConnection: db})
}));



app.use(express.urlencoded ({extended: true}));
// logging

app.use(helmet());

if (process.env.NODE_ENV != "production") {
// LOCALS 
  app.locals.appTitle = "fluffy";
  app.use(express.static('public'));
  app.use(morgan("tiny"));
} else {
  app.locals.appTitle = "1K 4,7";
}


// handlebars config
const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: helpers
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// MOUNTING ROUTER
//=================
app.use('/login', routes);
app.use('/', transactions);
app.use('/stats', stats);


// ERROR Handler
app.use((err, req, res, next) => {
  console.log("błąd", err);
  res.render('error', {layout: false, error: err});
});

// listen 
//==================
var listener = app.listen(3000, function () {
  console.log('Aplikacja nasłuchuje na porcie %s', listener.address().port);
});
