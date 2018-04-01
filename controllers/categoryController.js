const Category                 = require('../models/category');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody}           = require('express-validator/filter');
const async                    = require('async');


// CATEGORY LIST GET
//==============================================
exports.category_list = (req, res, next) => {
  async.parallel({
    incomes: cb => {
      Category.find({type: 'income'})
      .exec(cb);
      },
    
    outcomes: cb => {
      Category.find({type: 'outcome'})
      .exec(cb);
    }
    
  }, (err, results) => {
      if (err) return next(err);
      res.render('category', {data: results})
     
  })
};

//============================================
exports.category_create_get = (req, res) => {
  res.render('category_form', {title: "Utwórz nową kategorię"});
};

//=============================================================
//============= CATEGORY CREATE POST ==========================
//=============================================================
exports.category_create_post = [
  //validate - nazwa kategorii nie może być pusta
  body('name', 'Podaj nazwę kategorii!').trim().isLength({min: 1}),
  body('type', 'Wybierz typ kategorii!').isLength({min: 1}),
  
  //sanitize - escape and trim name 
  sanitizeBody('name').trim().escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    
    const category = new Category ({
      name: req.body.name,
      type: req.body.type
    });
    
    if (!errors.isEmpty()) {
      return res.render('category_form', {title: "Utwórz nową kategorię", errors: errors.array(), category: category});
    } 
    // no errors - checking for same name category
    Category.findOne({'name': category.name}, (err, found) => {
      if (err) return next(err);
      if (found){
        return res.render('category_form', {title: "Utwórz nową kategorię", errors: [{msg: 'Taka kategoria istnieje'}], category: category});
      }
      //its new category so save
      category.save(err => {
        if (err) return next(err);
        res.redirect('/categories')
      });  
    })
  }
];

// CATEGORY DETAIL GET
//===========================================

exports.category_detail_get = (req, res, next) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) return next(err);
    res.render('category_detail', {category: category});
  });
};


//===========================================
exports.category_update_get = (req, res, next) => {
  console.log('update get');
  Category.findById(req.params.id, (err, category) => {
    if (err) return next(err);
    res.render('category_form', {title: "Edytuj kategorię", category: category});
  });
};

exports.category_update_post = (req, res, next) => {
  res.send("JESZCZE NIE ZAIMPLEMENTOWANE");
};



// CATEGORY DELETE
//=========================
exports.category_delete = (req, res, next) => {
  Category.findByIdAndRemove(req.params.id, (err, found) => {
    if (err) return next(err);
    res.redirect('/categories');
  });
};