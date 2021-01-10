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
    }
})

//const event= mongoose.model('Event',eventSchema);

module.exports= mongoose.model("Request", requestSchema);
