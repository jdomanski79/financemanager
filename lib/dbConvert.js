const Transaction = require('../models/transaction');

module.exports = function () {
  Transaction.update({_id: "5a7812c12f6b590a6926378c"}, {$mul: {sum:10}}, (err, doc) => {
                        if (err) return console.log(err);
                         //doc.save();
                        })
}