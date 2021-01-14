const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');//this used for hashing the passwords to provide more secuirty
const jwt = require('jsonwebtoken');
const Joi = require('joi')
const Stadium = require('../models/Stadium')
const env = require('dotenv').config();
const getOID = require('../middleware/getOID');
const User = require('../models/User')


function joiValidate(req) {
    const schema = {
        name:
            Joi.string().min(3).max(30).required(),
        rows:
            Joi.number().integer().required(),
        cols:
            Joi.number().integer().required()


    }
    return Joi.validate(req, schema);
};


exports.createStadium = async (req, res) => {
    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    //check that the user is manager
    if (UserCheck.role == 'manager') {
        //First valdiate the coming data
        const { error } = joiValidate( req.body)
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        try {
            const stadium = new Stadium({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                rows: req.body.rows,
                cols: req.body.cols
                
            });
            let newStadium = await stadium.save();
            return res.status(200).json({ message: "Done" });
        } catch (err) {
            return res.status(500).json({ error: err });
        }
    } else {
        return res.status(404).json({ message: "only managers can create stadiums" });
    }
};


exports.getAllStdiums = async (req, res) => {
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if (UserCheck.role == 'manager') {
        const stadiums = await Stadium.find({},{name: 1,_id:0})

        return res.status(200).json({"stadiums":stadiums});
    } else {
        return res.status(404).json({ message: "only managers can create stadiums" });
    }
};