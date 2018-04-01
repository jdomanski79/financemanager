const express = require('express');
const router = express.Router();
const userController        = require('../controllers/userController');


module.exports = router;
// USER ROUTES
router.route('/')
  .get(userController.login_get)
  .post(userController.login_post);
