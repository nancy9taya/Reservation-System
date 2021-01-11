const mongoose = require('mongoose')

const Joi = require('joi')

const eventSchema = new mongoose.Schema({
    MatchID: {type:mongoose.Schema.Types.ObjectId,required:true},
    HomeTeam: {
      type: String,
      text:true
    },
    AwayTeam: {
      type: String,
      text:true
    },
    StadiumName: {
      type: String,
      text:true
    },
    MatchDate:{
        type: Date,
        required: true
    },
    MainReferee: {
      type: String,
      text:true
    },
    LinesMan1: {
      type: String,
      text:true
    },
    LinesMan2: {
      type: String,
      text:true
    }
})

//const event= mongoose.model('Event',eventSchema);

module.exports= mongoose.model("Event", eventSchema);
