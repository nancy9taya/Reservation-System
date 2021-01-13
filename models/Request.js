const mongoose = require('mongoose')

const Joi = require('joi')

const requestSchema = new mongoose.Schema({
    // userID :{
    //   type: String ,
    //   default: null
    // },
    name: {
      type: String,
      text:true
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
    status:{
      type:String,
      default:'pending'

    }
})

//const event= mongoose.model('Event',eventSchema);

module.exports= mongoose.model("Request", requestSchema);
