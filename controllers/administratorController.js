const mongoose = require('mongoose');
const Request = require('../models/Request');
const User = require('../models/User')
const getOID=require('../middleware/getOID');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();


async function createRequest (name,fn,ln,emaill){
//console.log("CReating new recuest")
//hello
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
    if(UserCheck){
        if (UserCheck.role == 'administrator') {
            let match = await Request.find({},{name:1,firstName:1,lastName:1,email:1,_id:1})
            return res.send(match);
        }
        else{
            return res.status(401).json({
            message: 'Auth failed'
            });
        }
    }
    else{
        return res.status(401).json({
        message: 'Auth failed'
        });
    }

};

exports.getAllUsers = async function(req, res) {
    //we need to add Firstname, LastName,City,Address
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if(UserCheck){
        if (UserCheck.role == 'administrator') {     
            let users = await User.find( { "_id": { $ne: decodedID } },{_id:1,name:1,firstName:1,lastName:1,role:1,email:1,status:1})
            return res.send(users);
        }

        else{
            return res.status(401).json({
            message: 'Auth failed'
            });
        }
    }
    else{
        return res.status(401).json({
        message: 'Auth failed'
        });
    }

};

exports.removeUser = async function(req, res) {
    let RemoveUserID = req.params.id;
    //console.log(username)
    const userOID = getOID(req);
    const UserCheck = await User.findOne({ _id: userOID });
    if(UserCheck){
        if (UserCheck.role == 'administrator'){

            const userRequestname = await User.findOne({ _id:RemoveUserID },{name:1,_id:0}); 
            const userID = await Request.findOne({name:userRequestname.name},{_id:1})
            if (userID){
                await Request.deleteOne({name:userRequestname.name})
            }
            await User.deleteOne({_id:RemoveUserID})
            
            return res.status(200).json({
                message: 'Delete User Successful'
            });
        }
        else{
            return res.status(401).json({
            message: 'Auth failed'
            });
        }
    }
    else{
        return res.status(401).json({
        message: 'Auth failed'
        });
    } 
  
};

exports.declineRequest = async function(req, res) {
    let DeclinedUserID = req.params.id;
    const userOID = getOID(req);
    const UserCheck = await User.findOne({ _id: userOID });
    if(UserCheck){
        if (UserCheck.role == 'administrator'){

            const userRequestname = await Request.findOne({ _id:DeclinedUserID },{name:1,_id:0}); 
            console.log(userRequestname)
            if(userRequestname){
                await Request.deleteOne({_id:DeclinedUserID});
                await User.deleteOne({ name: userRequestname.name });
                return res.status(200).json({
                    message: 'Decline Request Successful'
                });
            } else{
                return res.status(402).json({
                message: 'No user detected'
                });
            }
        }
        else{
            return res.status(401).json({
            message: 'Auth failed'
            });
        }
    }
    else{
        return res.status(401).json({
        message: 'Auth failed'
        });
    } 

}

exports.approveRequest = async function(req, res) {
 
    let username = req.params.id;
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if(UserCheck){
    if (UserCheck.role == 'administrator') {

    const userRequestname = await Request.findOne({ _id:username },{name:1,_id:0}); 
    var userID
    if(userRequestname){
        await Request.deleteOne({_id:username});
        userID = await User.findOne({ name: userRequestname.name },{_id:1});
    }
    console.log(userID)
    var token
        User.findOne({ _id: userID })
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
            User.updateOne({_id:userID},{token: token,status:"approved"})
                .exec()
                .then(result =>{
                return res.status(201).json({
                        message: 'Approval Successful',
                        token: token
                    });
                })
                .catch(err => {
                    console.log(err);
                   return  res.status(500).json({
                    error: err
                    });
                });     
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
            error: err
            });
        });
    }
    else{  
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
}else{  
    return res.status(401).json({
        message: 'Auth failed'
    });
}
};