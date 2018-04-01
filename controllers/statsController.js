const Transaction = require('../models/transaction');
const Category = require('../models/category');

module.exports = [
  (req, res, next) => {
    let stats = {
      outcomes: {},
      incomes : {}
    };
    
    getCategoriesByMonth( (er, found ) => {
      if (er) return next (er);
     
      
      found = found.map(element => {
        element.typeMonthSum = new Array(12).fill(0);
        element.categories = element.categories.map(category => {
          let data = new Array(13).fill(waluta(0));
          data[0] = category.name;
          category.months.forEach(month => {
            data[month.number] = waluta(month.sum);
            element.typeMonthSum[month.number-1] += month.sum;
          })
          return data;
        });
        element.typeMonthSum = element.typeMonthSum.map(sum => waluta(sum));
        return element;
      })
      
      // console.log(stats);
        //found = JSON.stringify(found);
      stats.outcomes.categories= found[0].type == "outcome" ? found[0].categories : found[1].categories;
      stats.outcomes.monthSum= found[0].type == "outcome" ? found[0].typeMonthSum : found[1].typeMonthSum;
      
      stats.incomes.categories = found[0].type == "income" ? found[0].categories : found[1].categories;
      stats.incomes.monthSum= found[0].type == "income" ? found[0].typeMonthSum : found[1].typeMonthSum
      //res.send(stats);  
      res.render('stats', {stats: stats});  
    })
  }
]
/*
  output = { type: "income",
            categories: {
              {name: "kategoria",
               months: [{num: 1, sum: 20}, {num: 2, sum: 50}]
            }
*/

function getCategoriesByMonth(cb) {
  return Transaction
    .aggregate([
      {
        $addFields: {
          year  : {$year: "$date"},
          month : {$month: "$date"},
        }
      },
      {
        $match: {
          year : new Date().getFullYear(), // bieżący rok
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
      {
        $unwind: "$categoryDoc"
      },
      {  
        $group: {
          _id : {
            "name": "$categoryDoc.name", 
            "type": "$categoryDoc.type", 
            "month": "$month"
          },
          categoryMonthSum: {$sum: "$sum"}
        }                  
      },
      {
        $group : {
          _id : {
            "name": "$_id.name", 
            "type": "$_id.type"
          },
          months: {
            $push : { 
              number: "$_id.month", 
              sum : "$categoryMonthSum" 
            }
          }
        }
      },
      {
        $group : {
          _id : "$_id.type",      
          categories: {
            $push: { 
              name: "$_id.name", 
              months: "$months"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          categories: 1,
        }
      },
  ],cb)
}


function waluta (sum) { 
  sum = (sum/100).toFixed(2).replace('.', ',');  
  let main = sum.slice(0,-3);
  
  const dec = sum.slice(-3),
        thousands = main.length % 3;

  if (main.length > 3) {
    main = main.slice(0,thousands) + " " + main.slice(thousands);  
  }
  return main + dec;
}