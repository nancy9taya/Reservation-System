const mongoose = require('mongoose');
const Request = require('../models/Request');

async function createRequest (name){
    console.log("CReating new recuest")
    const notification = new Request ({
        userName:name
  });
  notification.save()
};
exports.CreateNewRequest = createRequest

exports.getAllRequests = async function(req, res) {
    let match = await Request.find({},{userName:1,_id:0})
    return res.send(match);

};