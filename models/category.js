'uses strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const categorySchema = new Schema({
  type  : {type: String, enum: ['income', 'outcome'], lowercase: true},
  name  : {type: String, lowercase: true}
});

categorySchema
  .virtual('url')
  .get( function (){ 
          return '/category/'+ this._id
});
      

module.exports = mongoose.model('Category', categorySchema); 