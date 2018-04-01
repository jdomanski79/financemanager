'uses strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  login  : {type: String, lowercase: true},
  name   : String,
  hash  : {type: String}
});

userSchema
  .virtual('url')
  .get( function (){ 
          return '/user/'+ this._id
});
      

module.exports = mongoose.model('User', userSchema); 
