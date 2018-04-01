const Transaction = require('../models/transaction');
const Category = require('../models/category');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody}           = require('express-validator/filter');
const async                    = require('async');


// HOME ROUTE
exports.index = (req, res, next) => {
  const today = new Date();//Date("2018-01-01");
  async.parallel({
    outcomes: function (cb) {
      getCategoriesByType(today, "outcome").exec(cb)
    },
    
    incomes : function(cb) {
      getCategoriesByType(today, "income").exec(cb)
    }
  }, (err, found) => {
      if (err) return next(err);
      
      if (found.incomes.length > 0) {
        res.locals.bilans = found.incomes[0].total;
        res.locals.incomes = {
          total: waluta(found.incomes[0].total),
          categories: found.incomes[0].categories.map(c => ({name: c.name, sum: waluta(c.sum)}))
        }
      } else {
        res.locals.bilans = 0;
        res.locals.incomes = {total : 0}
      };
      
      if (found.outcomes.length > 0) {
        res.locals.bilans -= found.outcomes[0].total;
        res.locals.outcomes = {
          total: waluta(found.outcomes[0].total),
          categories: found.outcomes[0].categories.map(c => ({name: c.name, sum: waluta(c.sum)}))
        }
      } else {
        res.locals.outcomes = {total : 0}
      };
       
      res.locals.bilans = waluta(res.locals.bilans);
      
    
    res.render("home", {title: "Strona domowa"});
   }
  );
};

// TRANSACTIONS LIST
exports.list = (req, res, next) => {
  let query = {};
  if (req.query.description){
    query.$text = {$search: req.query.description};
  }
  if (req.query.category) {
    query.category = req.query.category;
  }
  console.log(query);
  async.parallel({
    categories: cb => {
      Category.find({}).exec(cb);
    },
    transactions: cb => {
      Transaction.find(query)
        .populate('category', 'name type')      
        .populate('createdBy', 'name')
        .sort({created: -1})
        .select('date sum description')
        .exec(cb)
    }
  }, 
    (err, data) => {
        if (err) return next(err);
        
        res.locals.transactions = data.transactions;
        res.locals.categories = data.categories.map(category => 
          { if (category._id == req.query.category) {
            category.selected = "selected";
            };
            return category;
          });
        //res.locals.query = req.query;
        res.render("transaction_list", {title: "Lista transakcji"});
    }
  )
};

// === TRANSACTION CREATE GET ===
exports.transaction_create_get = (req, res, next) => {
  // const categories = getCategories(next);
  // console.log(categories);
  Category.find({}, (err, categories)=>{
    if (err) return next(err);
    res.render('transaction_form', {title: 'Nowa transakcja', categories: categories, date: new Date().toISOString().slice(0,10)});
  });
};

// === Transaction create POST ===
exports.transaction_create_post = [
  //validation
  body('date',"Nieprawidłowy format daty").trim().isISO8601(),
  body('sum', "Nieprawidłowy format kwoty").trim().isFloat(),
  body('category', "Błąd kategorii ").isMongoId(),
  
  //sanitization
  sanitizeBody('date').toDate(),
  sanitizeBody('sum').toFloat(),
  sanitizeBody('description').trim().escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    
    const transaction = new Transaction({
      date        : req.body.date,
      sum         : req.body.sum,
      category    : req.body.category,
      description : req.body.description,
      createdBy   : req.session.user._id
    });
    
    if (!errors.isEmpty()) {
      Category.find({}, (err, categories)=>{
        if (err) return next(err);
        return res.render('transaction_form', 
                          {title: 'Utwórz nową kategorię', 
                           categories: categories, 
                           errors: errors.array(),
                           transaction: transaction});
      });
    } else {
      // no validation errors
      transaction.save(err =>{
        if (err) return next(err);
        res.redirect('/transactions');
      })
    }
  }
]
// === transaction detail get ==
exports.transaction_detail_get =[
  (req, res, next) => {
    Transaction.findById(req.params.url)
      .populate("category", "name")
      .populate("createdBy", "name")
      .exec( (err, transaction) => {
        if (err) return next(err);
        res.locals.transaction = transaction;
        res.render("transaction_detail");
    })
  }
]

// ==== helper functions ===

function getCategoriesByType (date, categoryType) {
  return Transaction
            .aggregate([
              {
                $addFields: {
                  year  : {$year: "$date"},
                  month : {$month: "$date"},
                 // sum   : {$multiply: ["$sum", 0.01]}
                }
              },
              {
                $lookup: {
                  from: "categories",
                  localField: "category",
                  foreignField: "_id",
                  as : "categoryDoc"
                },
              },
              {$unwind: "$categoryDoc"},          
              {
                $match: {
                  year : date.getFullYear(),
                  month: date.getMonth() + 1,
                  "categoryDoc.type" : categoryType     
                }
              },
              {
                $group: {
                  _id: "$categoryDoc.name", 
                  categorySum: {$sum: "$sum"},
                },
              },
              {
                $sort: {categorySum: -1}
              },
              {
                $group: {
                  _id: null,
                  total: {$sum: "$categorySum"},
                  categories: {$push: {name: "$_id", sum: "$categorySum"}}
                }
              }
  ])
}

function waluta (sum) { 
  sum = (sum/100).toFixed(2).replace('.', ',');  
  let main = sum.slice(0,-3);
  
  const dec = sum.slice(-3),
        thousands = main.length % 3;

  if (main.length > 3) {
    main = main.slice(0,thousands) + " " + main.slice(thousands);  
  }
  return main + dec;
}