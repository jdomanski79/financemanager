const Transaction = require('../models/transaction');
const Category = require('../models/category');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody}           = require('express-validator/filter');
const async                    = require('async');


// EXPORTS
exports.index = (req, res, next) => {
  const today = new Date();//Date("2018-01-01");
  async.parallel({
    outcomes: function (cb) {
      getCategoriesByType(today, "outcome").exec(cb)
    },
    
    incomes : function(cb) {
      getCategoriesByType(today, "income").exec(cb)
    }
  },
  (err, found) => {
      //found = found.toObject();
      console.log('Callback!', found);
      if (err) return next(err);
      res.render("home", {title: "Strona domowa", data: found, bilans: found.incomes[0].total - found.outcomes[0].total});
    }
  );
};

// TRANSACTIONS LIST
exports.list = (req, res, next) => {
  Transaction.find({})
    .populate('category')      
    .populate('createdBy')
    .sort({created: -1})
    .exec( (err, transactions) => {
      if (err) return next(err);
      //console.log("transactions", transactions);
      res.render("transaction_list", {title: "Lista transakcji", transactions: transactions});
  })
  
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
      transactionDate: req.body.date,
      sum            : req.body.sum,
      category       : req.body.category,
      description    : req.body.description,
      createdBy      : req.session.user._id
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


// ==== helper functions ===

function getCategoriesByType (date, categoryType) {
  return Transaction
            .aggregate(
              {
                $addFields: {
                  year: {$year: "$transactionDate"},
                  month: {$month: "$transactionDate"}
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
                $group: {
                  _id: null,
                  total: {$sum: "$categorySum"},
                  categories: {$push: {name: "$_id", sum: "$categorySum"}}
                }
              }
  )
}