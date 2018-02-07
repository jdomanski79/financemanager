'uses strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const transactionSchema = new Schema({
  created        : { type: Date, default: Date.now},
  transactionDate: Date,
  category       : { type: Schema.Types.ObjectId, ref: "Category" },// required: true},
  sum            : {type: Number},
  description    : String,
  createdBy      : {type: Schema.Types.ObjectId, ref: "User"}
});

transactionSchema
  .virtual('url')
  .get(function (){
    return '/transaction/'+ this._id;
  });

transactionSchema
  .virtual('date')
  .get( function (){
    return this.transactionDate.toDateString();
});

transactionSchema
  .virtual('year')
  .get( function (){
    return this.transactionDate.getFullYear();
});





module.exports = mongoose.model('Transaction', transactionSchema); 