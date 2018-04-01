const express = require('express');
const router  = express.Router();

// controler modules
// ===================

const stats    = require('../controllers/statsController');

router.route('/')
  .get(stats);


module.exports = router;