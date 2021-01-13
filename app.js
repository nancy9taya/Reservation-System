 const express = require("express");
  const app = express();
  const morgan = require("morgan");
  const bodyParser = require("body-parser");
  const mongoose = require("mongoose");
  const userRoutes = require('./routes/user');
  const matchRoutes = require('./routes/match');
  const administratorRoutes = require('./routes/administrator');
  const cors=require('cors');
 const database = require('./DB/Connection')
 let db =  "mongodb+srv://arwa:projectconsultation@cluster0.kimgs.mongodb.net/ReservationSystem?retryWrites=true&w=majority";
 
 //let db="mongodb://localhost/MaestroApp"
  /* mongoose
    .connect(db, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify:false,
      useUnifiedTopology: true
    })
    .then(() => winston.info(`Connected to MongoDB...`))*/
    //const mongoConnectionSettings = config.read();
   // const migrated = up(db, client);
    //migrated.forEach(fileName => console.log('Migrated:', fileName));
    const URI =  "mongodb+srv://arwa:projectconsultation@cluster0.kimgs.mongodb.net/ReservationSystem?retryWrites=true&w=majority";
    // mongoose.connect(URI,{useUnifiedTopology: true, useNewUrlParser: true })
    // console.log('db connected.. !')
    
    
    //database.connectDB();
  mongoose.connect(URI, { useNewUrlParser: true ,useUnifiedTopology: true ,useCreateIndex: true  }).
  catch(error => handleError(error));
  
  mongoose.set('useFindAndModify', false);

  mongoose.Promise = global.Promise;
 
  app.use('/uploads', express.static('uploads'));
  app.use('/images', express.static('/images'));
  app.use(morgan("dev"));
  app.use('/uploads', express.static('uploads'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());

  
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
  
  // Routes which should handle requests


  app.use("/user", userRoutes);
  app.use("/match", matchRoutes);
  app.use("/adm", administratorRoutes);

  
  app.use((req, res, next) => {
    const error = new Error("the request you want isn't supported yet");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
  module.exports = app;


