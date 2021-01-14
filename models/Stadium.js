const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const stadiumSchema = mongoose.Schema({
  _id: {
      type:mongoose.Schema.Types.ObjectId,
      required:true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  shape:{
    type: String,
    default: "Rectangular"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  rows:{
    type: Number,
    required: true
  },
  cols:{
    type: Number,
    required: true
  }
  
},
{ collection: 'stadiums' });

module.exports= mongoose.model('Stadium', stadiumSchema);


 
