const Transaction = require('../models/transaction');

module.exports = function () {
  Transaction.update({}, {$mul: {sum:100}},{multi: true}, (err, doc) => {
                        if (err) return console.log(err);
                         //doc.save();
                        })
}