const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const reservationSchema = mongoose.Schema({
  _id: {
      type:mongoose.Schema.Types.ObjectId,
      required:true
  },
  match: {
    type: mongoose.Schema.Types.ObjectId , 
    required:true,
    ref:'Event'
  },
  user:{
    type: mongoose.Schema.Types.ObjectId , 
    required:true,
    ref:'User'
  },
  seatNo:[{
       type: String,
       default:[]    // user can reserve more than one seat
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  tickets:[[]]
  
},
{ collection: 'reservations' });

module.exports= mongoose.model('Reservation', reservationSchema);


 
