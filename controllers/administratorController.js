const mongoose = require('mongoose');
const Request = require('../models/Request');
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();


async function createRequest (name,fn,ln,emaill){
    console.log("CReating new recuest")
    const notification = new Request ({
        name:name,
        firstName:fn,
        lastName:ln,
        email:emaill
  });
  notification.save()
};
exports.CreateNewRequest = createRequest

exports.getAllRequests = async function(req, res) {
    let match = await Request.find({},{name:1,firstName:1,lastName:1,email:1,_id:0})
    return res.send(match);

};

exports.getAllUsers = async function(req, res) {
    //we need to add Firstname, LastName,City,Address
    let users = await User.find({},{_id:0,name:1,firstName:1,lastName:1,role:1,email:1,status:1})
    return res.send(users);

};

exports.removeUser = async function(req, res) {
    let username = req.params.username;
    console.log(username)
    await User
    .deleteOne({name:username})
    return res.status(200).json({
        message: 'Delete User Successful'
      });
  

};
exports.approveRequest = async function(req, res) {
   let username = req.params.username;
   await Request.deleteOne({name:username});
   var token
    User.findOne({ name: username })
    .exec()
     .then(user => {
         console.log(user)
       if (user.length < 1) {
         return res.status(409).json({
           message: 'Username doesnot exist'
         });
       }  
       else {       
            token = jwt.sign(
            { _id: user._id,
                name: user.name, 
            },
            process.env.JWTSECRET
            );
         }
         User.updateOne({name:username},{token: token,status:"approved"})
            .exec()
            .then(result =>{
               return res.status(201).json({
                    message: 'Approval Successful',
                    token: token
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                error: err
                });
            });     
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
   });  

};