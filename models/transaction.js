'uses strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const transactionSchema = new Schema({
  created        : { type: Date, default: Date.now},
  date           : { type: Date},//, get: date => date.toDateString(), set: date => date},
  category       : { type: Schema.Types.ObjectId, ref: "Category" },
  sum            : { type: Number, set: sum => sum * 100},
  description    : { type: String, text: true},
  createdBy      : { type: Schema.Types.ObjectId, ref: "User"},
  editedBy       : { type: Schema.Types.ObjectId, ref: "User"},
  editedAt       : { type: Date}
});

// transactionSchema.index = ({description: 1}, {name: "description"});

transactionSchema
  .virtual('url')
  .get(function (){
    return '/transaction/'+ this._id;
  });

transactionSchema
  .virtual('shortDate')
  .get (function () {
    const months = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
    const month = months[this.date.getMonth()];
    const day = this.date.getDate();
    return day + ' ' + month;
});

transactionSchema
  .virtual('currency')
  .get(function waluta () { 
      const sum = (this.sum/100).toFixed(2).replace('.', ',');  
      let main = sum.slice(0,-3);
  
      const dec = sum.slice(-3),
            thousands = main.length % 3;

      if (main.length > 3) {
        main = main.slice(0,thousands) + " " + main.slice(thousands);  
      }
    return main + dec;
});

module.exports = mongoose.model('Transaction', transactionSchema); 
