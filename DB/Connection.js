const mongoose = require('mongoose');

const URI =  "mongodb+srv://arwa:projectconsultation@cluster0.kimgs.mongodb.net/ReservationSystem?retryWrites=true&w=majority";
const connectDB = async () =>{
   await mongoose.connect(URI,{useUnifiedTopology: true, useNewUrlParser: true })
   console.log('db connected.. !')
}

module.exports = connectDB;