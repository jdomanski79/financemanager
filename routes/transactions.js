const express = require('express');
const router  = express.Router();

// controler modules
// ===================

const categoryController    = require('../controllers/categoryController');
const transactionController = require('../controllers/transactionsController');
const userController        = require('../controllers/userController');

// ===================
module.exports = router;

// ROUTES
//===============

router.all('*', (req, res, next) =>{
  if (req.session && req.session.authenticated){
    res.locals.user = req.session.user;
    //console.log("Session id: ", req.session.id);
    return next();
  }
  res.redirect('/login');
  });

router.route('/logout')
  .get(userController.logout_get)
  .post(userController.logout_post);


// ================ DB Conversions - temporary
router.get('/db/convert', (req, res) => {
  require('../lib/dbConvert')();
  res.redirect('/transactions');
});


// GET home page
router.get('/', transactionController.index);





// === TRANSACTION ROUTES === 
router.route("/transactions")
  .get(transactionController.list);

router.route("/transaction/create")
  .get( transactionController.transaction_create_get)
  .post(transactionController.transaction_create_post);


// === CATEGORIES ROUTES ===
// GET request to list categories
router.get('/categories', categoryController.category_list);

//GET and POST request for create category
router.route('/category/create')
  .get(categoryController.category_create_get)
  .post(categoryController.category_create_post);

router.route('/category/:id')
  .get(categoryController.category_detail_get);

router.get('/category/:id/delete', categoryController.category_delete);

router.route('/category/:id/update')
  .get( categoryController.category_update_get)
  .post(categoryController.category_update_post);