const bcrypt = require('bcryptjs');
const User   = require('../models/user');



exports.login_get = (req, res) => {
  res.render('login', {layout: false, title: "Zaloguj się"});
};

exports.login_post = [
  
  (req, res, next) =>{
    User.findOne({'login': req.body.username}, (err, user) =>{
      if (err) return next(err);
      if (!user) return res.render('login', {layout: false, error: "Nie znaleziono użytkownika"});
      
      
      bcrypt.compare(req.body.password, user.hash, (err, success) => {
        if (err) return next(err);
        if (!success) return res.render('login', {layout: false, error: "Nieprawidłowe hasło."});
        
        req.session.authenticated = true;
        req.session.user = {
          _id  : user._id, 
          name: user.name, 
        };
        res.redirect('/');
      });
    });
  }
]

exports.logout_get = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

exports.logout_post = (req, res) =>{
  res.send('Nie zaimplementowane');
};

