const mongoose = require('mongoose')
const Joi = require('joi')

const matchSchema = new mongoose.Schema({
    Stadiumname: {
      type: String,
      text:true
    },
    MatchDate:{
        type: Date,
        required: true
      }
})

const Match= mongoose.model('Match',matchSchema);
exports.Match= Match ;