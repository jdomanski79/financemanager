'uses strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const transactionSchema = new Schema({
  created        : { type: Date, default: Date.now},
  date           : { type: Date, get: date => date.toDateString()},
  category       : { type: Schema.Types.ObjectId, ref: "Category" },// required: true},
  sum            : { type: Number},
  description    : String,
  createdBy      : {type: Schema.Types.ObjectId, ref: "User"}
});

transactionSchema
  .virtual('url')
  .get(function (){
    return '/transaction/'+ this._id;
  });


module.exports = mongoose.model('Transaction', transactionSchema); 