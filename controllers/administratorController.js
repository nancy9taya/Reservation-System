const mongoose = require('mongoose');
const Request = require('../models/Request');
const User = require('../models/User')
const getOID=require('../middleware/getOID');

async function createRequest (name,fn,ln,emaill){
//console.log("CReating new recuest")
    const notification = new Request ({
        name:name,
        firstName:fn,
        lastName:ln,
        email:emaill
  });
  notification.save()
};
exports.CreateNewRequest = createRequest

exports.getAllRequests = async function(req, res){
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if (UserCheck.role == 'administrator') {
        let match = await Request.find({},{name:1,firstName:1,lastName:1,email:1,_id:1})
        return res.send(match);
    }
    return res.status(401).json({
        message: 'Auth failed'
      });

};

exports.getAllUsers = async function(req, res) {
    //we need to add Firstname, LastName,City,Address
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if (UserCheck.role == 'administrator') {     
        let users = await User.find( { "_id": { $ne: decodedID } },{_id:1,name:1,firstName:1,lastName:1,role:1,email:1,status:1})
        return res.send(users);
    }
    return res.status(401).json({
        message: 'Auth failed'
      });

};

exports.removeUser = async function(req, res) {
    let username = req.params.id;
    //console.log(username)
   
    const userOID=getOID(req);
    const UserCheck = await User.findOne({ _id: userOID });
    if (UserCheck.role == 'administrator') {
        await User
        .deleteOne({_id:username})

        return res.status(200).json({
            message: 'Delete User Successful'
          });
    }
    return res.status(401).json({
        message: 'Auth failed'
      });
 
  
};
exports.approveRequest = async function(req, res) {
    let username = req.params.id;
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if (UserCheck.role == 'administrator') {
        await User
        .updateOne({_id:username},{'status':"approved"} );

        await Request
        .deleteOne({name:username});

        return res.status(200).json({
            message: 'Approval Successful'
          });
      
    }
    return res.status(401).json({
        message: 'Auth failed'
      });

    

};