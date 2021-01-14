const mongoose = require('mongoose');
const Joi = require('joi')
const Event = require('../models/Event')
const getOID=require('../middleware/getOID');
const User = require('../models/User')
const Stadium= require('../models/Stadium')

exports.CreateNewEvent = async function(req, res, next) {
    console.log("Event document Created.")
    console.log(req.body)
    //console.log("Event document Created.")
    //console.log(req.body.AwayTeam)  
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    if (UserCheck.role == 'manager' && UserCheck.status == 'approved') {    

        if (req.body.HomeTeam == req.body.AwayTeam)
            return res.status(500).send({ msg: 'Home Team should not be the same as the Away Team ' });     
        console.log(req.body.MatchDate)
        var aheadOfTime = new Date(req.body.MatchDate);
        aheadOfTime.setHours( aheadOfTime.getHours() + 2 );

        var BeforeTime = new Date(req.body.MatchDate);
        BeforeTime.setHours( BeforeTime.getHours() - 2 );

         var stadiumsReservationCheck = await  Event.find({$and: [{MatchDate:{$gte:BeforeTime}},{MatchDate:{$lte:aheadOfTime}},
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

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}
exports.EditExistingEvent = async function(req, res, next) {

    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    var checkdate = new Date(req.body.MatchDate);
    if (UserCheck.role == 'manager' && UserCheck.status == 'approved') {    
        if(isValidDate(checkdate)){
        let MatchID = req.params.id;
        if (req.body.HomeTeam == req.body.AwayTeam)
        return res.status(500).send({ msg: 'Home Team should not be the same as the Away Team ' });     
        
        const getCurrentMatch = await Event.findOne({MatchID:MatchID});
      
        var CurrentDate = new Date (getCurrentMatch.MatchDate);

        if (getCurrentMatch.StadiumName == req.body.StadiumName
             &&CurrentDate.getDate()==checkdate.getDate() &&
             CurrentDate.getTime()==checkdate.getTime() ){
            //No Check Required for stadium
            await Event
            .updateOne({MatchID:MatchID},{'HomeTeam':req.body.HomeTeam,'AwayTeam':req.body.AwayTeam,'StadiumName':req.body.StadiumName,
                                        'MatchDate':req.body.MatchDate,'MainReferee':req.body.MainReferee,
                                        'LinesMan1':req.body.LinesMan1,'LinesMan2':req.body.LinesMan2 } );
            return res.status(200).json({
            message: 'Edit Successful'
            });
        }else{
            var aheadOfTime = new Date(req.body.MatchDate);
            aheadOfTime.setHours( aheadOfTime.getHours() + 2 );

            var BeforeTime = new Date(req.body.MatchDate);
            BeforeTime.setHours( BeforeTime.getHours() - 2 );
            //console.log(aheadOfTime)
            //console.log(checkdate)
            var stadiumsReservationCheck = await  Event.find({$and: [{MatchDate:{$gte:BeforeTime}},{MatchDate:{$lte:aheadOfTime}},
                {StadiumName:{$eq:req.body.StadiumName}}]})
            console.log(stadiumsReservationCheck)
            
            if(stadiumsReservationCheck.length == 1 && stadiumsReservationCheck[0].MatchID == MatchID || stadiumsReservationCheck.length==0 ){
                await Event
                .updateOne({MatchID:MatchID},{'HomeTeam':req.body.HomeTeam,'AwayTeam':req.body.AwayTeam,'StadiumName':req.body.StadiumName,
                                            'MatchDate':req.body.MatchDate,'MainReferee':req.body.MainReferee,
                                            'LinesMan1':req.body.LinesMan1,'LinesMan2':req.body.LinesMan2 } );
                return res.status(200).json({
                message: 'Edit Successful'
                });
            } else{
                    return res.status(402).send({ msg: 'Stadium already reserved' });  
                
            }
        }
        }else{
            return res.status(401).json({
                message: 'Invalid Date'
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

exports.ViewAllEvents = async function(req, res, next) {
    let match = await Event.find();

    console.log(match)

    return res.status(200).json({
        "match":match
    })
};
function genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
        a.push(String.fromCharCode(i));
    }
    return a;
}
exports.viewAllSeats = async function(req, res, next) {
    const decodedID = getOID(req);
    const UserCheck = await User.findOne({ _id: decodedID });
    const matchID = req.params.id;
    const match = await Event.findOne({ MatchID: matchID });
    if (UserCheck.role == 'manager') {
            try {
                const reservedSeats = match.seats;
                const stadium = await Stadium.findOne({ name: match.StadiumName });
                let arrCols = Array.from(Array(stadium.cols).keys())
                let removed = arrCols.shift()
                let char = genCharArray('A', 'Z');
                let arrRows = char.slice(0, stadium.rows)
                return res.status(200).json({
                    seats: reservedSeats,
                    cols: arrCols,
                    rows: arrRows
                   });

            } catch (err) {
                return res.status(500).json({ error: err });
            }
    } else {
    return res.status(404).json({ message: "only managers can view seats" });
           }
};
