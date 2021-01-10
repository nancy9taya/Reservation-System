const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const userSchema = mongoose.Schema({
  _id: {type:mongoose.Schema.Types.ObjectId,required:true},
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    minlength: 5,
    maxlength: 128,
    unique: true
  },
  password: {
    type: String
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
    type: Boolean,
    required: true
  },
  appId:{
    type: String ,
    default: null
  },
  providInfo:{
    type: Boolean,
    default: false
  },
  country:{
    type: String,
    default: 'Egypt'
  },
  type:{
    //three types: free artist premium
    type: String,
    default: 'free'
  },
  active:{
    type: Boolean,
    default: false
  },

 token:{
    type: String,
    default: null
  },
  phone:{
    type: String,
    default: null
  },
  role:{
    type: String,
    default: null
  },
  status:{
    type: String,
    default: null
  }
});

module.exports= mongoose.model('User', userSchema);


 
