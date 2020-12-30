const {MongoClient} = require('mongodb');
const express = require('express');
const connectDB = require('./DB/Connection');
const app = express();

connectDB();
const Port = process.env.Port || 1000;

app.listen(Port,()=>console.log("server started"));
