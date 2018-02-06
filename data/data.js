//module.exports = {date: "2015-02", category: "jakaś kategoria"}
module.exports.transaction = [
  {date       : "2017-12-01",
   category   : "Jedzenie",
   sum        : "25",
   description: "spożywcze"
  },
  {date       : "2017-02-01",
   category   : "Jedzenie",
   sum        : "25",
   description: "spożywcze"
  },
  {date       : "2016-02-01",
   category   : "Spanie",
   sum        : "25",
   description: "Jakieś inne"
  },
  {date       : "1999-02-01",
   category   : "Auto",
   sum        : "25",
   description: "ważne zakupy"
  }
];

module.exports.categories = [
  {name: "Jedzenie"},
  {name: "Spanie"},
  {name: "Rachunki"}
]

module.exports.sumCategory =  function sumCategory(data){
  let sum = {};
  data.transaction.forEach(transaction => {
    if (sum[transaction.category] !== undefined ){
      sum[transaction.category] +=Number(transaction.sum);
    } else {
      sum[transaction.category] = Number(transaction.sum);
    } 
  });
  return {category:sum}; 
 }    


