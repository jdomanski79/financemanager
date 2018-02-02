(function(){
 function sumCategory(data){
  let sum = {};
  data.forEach(transaction => {
    sum[transaction.category] += transaction.sum;
  });
  return sum; 
 }    

})();
