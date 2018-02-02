"use strict";
(function(){
  let today = new Date().toISOString().slice(0,10);
  document.getElementById("date").value =  today;
})();
