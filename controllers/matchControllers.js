const mongoose = require('mongoose');
const Joi = require('joi')
const Event = require('../models/Event')
const getOID=require('../middleware/getOID');
const User = require('../models/User')


exports.CreateNewEvent = async function(req, res, next) {
    //console.log("Event document Created.")
    //console.log(req.body.AwayTeam)
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if (UserCheck.role == 'manager' && UserCheck.status == 'approved') {    

        if (req.body.HomeTeam == req.body.AwayTeam)
            return res.status(500).send({ msg: 'Home Team should not be the same as the Away Team ' });     
        
        var aheadOfTime = new Date(req.body.MatchDate);
        aheadOfTime.setHours( aheadOfTime.getHours() + 2 );
        var stadiumsReservationCheck = await  Event.find({$and: [{MatchDate:{$gte:req.body.MatchDate}},{MatchDate:{$lte:aheadOfTime}},
                                                    {StadiumName:{$eq:req.body.StadiumName}}]})
        
        if(stadiumsReservationCheck.length>0){
            return res.status(402).send({ msg: 'Stadium already reserved' });  
        }
        else{
            const match = new Event({
                MatchID: new mongoose.Types.ObjectId(),
                HomeTeam:req.body.HomeTeam,
                AwayTeam:req.body.AwayTeam,
                StadiumName:req.body.StadiumName,
                MatchDate:req.body.MatchDate,
                MainReferee:req.body.MainReferee,
                LinesMan1:req.body.LinesMan1,
                LinesMan2:req.body.LinesMan2
            })
            match.save()
            return res.status(200).json({message :'OK'})
        }
    }else{
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

exports.EditExistingEvent = async function(req, res, next) {

    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if (UserCheck.role == 'manager' && UserCheck.status == 'approved') {    
        let MatchID = req.params.id;
        if (req.body.HomeTeam == req.body.AwayTeam)
        return res.status(500).send({ msg: 'Home Team should not be the same as the Away Team ' });     
        
        var aheadOfTime = new Date(req.body.MatchDate);
        aheadOfTime.setHours( aheadOfTime.getHours() + 2 );
        var stadiumsReservationCheck = await  Event.find({$and: [{MatchDate:{$gte:req.body.MatchDate}},{MatchDate:{$lte:aheadOfTime}},
            {StadiumName:{$eq:req.body.StadiumName}}]})
        if(stadiumsReservationCheck.length>0){
            return res.status(402).send({ msg: 'Stadium already reserved' });  
        }
        else{
            await Event
            .updateOne({MatchID:MatchID},{'HomeTeam':req.body.HomeTeam,'AwayTeam':req.body.AwayTeam,'StadiumName':req.body.StadiumName,
                                        'MatchDate':req.body.MatchDate,'MainReferee':req.body.MainReferee,
                                        'LinesMan1':req.body.LinesMan1,'LinesMan2':req.body.LinesMan2 } );
            return res.status(200).json({
            message: 'Edit Successful'
            });
        }
    }else{
        return res.status(401).json({
            message: 'Auth failed'
        });
    }

};

exports.FindExistingEvent = async function(req, res, next) {
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if (UserCheck.role == 'manager' && UserCheck.status == 'approved') {    
    
        let match = await Event.findOne({MatchID:req.params.id }, {'_id':0,'MatchID':0})
        return res.send(match);
    }
    return res.status(401).json({
        message: 'Auth failed'
    });
};