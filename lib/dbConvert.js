const Transaction = require('../models/transaction');

module.exports = function () {
  return Transaction
            .aggregate(
              {
                $addFields: { "date1": "$transactionDate", "bla": 1},
                
              },
              {
                $out: "transactions"
              }).exec();
}