const Transaction = require('../models/transaction');

module.exports = function () {
 return Transaction
            .aggregate(
              {
                $addFields: { "date": "$transactionDate"}
              },
              {
                $out: "transactions"
              })
}
