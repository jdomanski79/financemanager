const Transaction = require('../models/transaction');

exports.sumConvertToGrosz = function () {
  Transaction.update({},{sum: 1 }, (err, changed) => {
                        if (err) return console.log(err);
                         console.log(changed);
                        })
}