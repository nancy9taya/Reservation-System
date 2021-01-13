const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userSchema = mongoose.Schema({
  _id: {type:mongoose.Schema.Types.ObjectId,required:true},
  name: {
    type: String,
    required: true
  },
  firstName:{
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    minlength: 5,
    maxlength: 128
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
 birthDate:{
    type: Date,
    required: true
  },
  gender:{
    type: String,
    required: true
  },
  city:{
    type: String,
    default: 'Cairo',
    required: true
  },
  active:{
    type: Boolean,
    default: false
  },
 token:{
    type: String,
    default: null
  },
  address:{
    type: String,
    default: null,

  },
  role:{
    type: String,//Manger / Fan 
    required: true,
    default: null
  },
  status:{
    type:String,
    default: "approved"
  }
});

module.exports= mongoose.model('User', userSchema);


 
