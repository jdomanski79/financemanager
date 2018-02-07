const Transaction = require('../models/transaction');

module.exports = function () {
  Transaction.findByIdAndUpdate({_id: "5a7812c12f6b590a6926378c"}, (err, doc) => {
                        if (err) return console.log(err);
                         doc.sum = doc.sum * 10;
                      
                        })
}