const mongoose = require('mongoose');
const Joi = require('joi')
const Reservation = require('../models/Reservation')
const getOID = require('../middleware/getOID');
const User = require('../models/User')
const Match = require('../models/Event')
var uniqueNumber = require('random-key');

function joiValidate(req) {
    const schema = {
        seatNo:
            Joi.array().items(Joi.string().required()).required(),
        creditCard:
            Joi.string().length(16).regex(/^\d+$/).required(),
        pinNumber:
            Joi.string().length(4).regex(/^\d+$/).required()
    }
    return Joi.validate(req, schema);
};
function ValidateSeat(req) {
    const schema = {
        seatNo:
            Joi.string().required()
    }
    return Joi.validate(req, schema);
};


function searchStringInArray(str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return true;
    }
    return false;
}

function generateTickets(no) {
    let arr = []
    for (var j=0; j<no; j++) {
        arr.push(uniqueNumber.generate(30))
    }
    return arr;
}


exports.reserveSeat = async (req, res) => {
    const decodedID = getOID(req);
    const matchID = req.params.id;
    const match = await Match.findOne({ MatchID: matchID });
    //First valdiate the coming data
    const { error } = joiValidate(req.body)
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    try {

        let reservedSeats = match.seats;
        let orderedSeats = req.body.seatNo;
        let actualreserved= [];
        let faildReserved = [];
        let count = 0 ;
        while(count < orderedSeats.length){
            let seat = orderedSeats[count];
            let result = searchStringInArray (seat, reservedSeats) 
            if(result){
                faildReserved.push(seat)
            }else{
                actualreserved.push(seat)
                reservedSeats.push(seat)
                const modifiedMatch = await Match.updateOne({MatchID: matchID},{seats:reservedSeats});
            }
            count++;
        }
        console.log(faildReserved)
        if(actualreserved.length == 0){
            return res.status(404).json({ message:"the seat/s ordered is not available" });
        }else{
        const reservation = new Reservation({
            _id: new mongoose.Types.ObjectId(),
            match: matchID,
            user: decodedID,
            seatNo:actualreserved
        });
        let no = actualreserved.length
        let ticketsNo = generateTickets(no)
        let allTickets = actualreserved.map(function (x, i) { 
            return [x, ticketsNo [i]]
        });
        reservation.tickets=allTickets
        let ourReservation = await reservation.save();
        return res.status(200).json({
             message: "your reservation is done",
             ticket: allTickets 
            });

        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

function deleteRow(arr, row) {
    arr = arr.slice(0); // make copy
    arr.splice(row - 1, 1);
    return arr;
 }

exports.CancelSeat = async (req, res) => {
    const decodedID = getOID(req);
    const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
    //First valdiate the coming data
    const { error } = ValidateSeat(req.body)
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }
    try {
            let seat = req.body.seatNo;
            const matchID = req.params.id;
            const match = await Match.findOne({ MatchID: matchID });
            console.log(match)
            const reserveList= await Reservation.find({seatNo: seat });
            const reserve = reserveList[0]
            console.log(reserve)
            var strDate = match.MatchDate.toISOString();
            var date1 = strDate.substring(0, 10);
            var isoDate = new Date().toISOString()
            var date2 = isoDate.substring(0, 10);
            var diff=  diffDays(new Date(date1), new Date(date2));   
            
            if(diff >= 3){
                console.log("entered")
                let matchSeats = match.seats;
                console.log(matchSeats)
                let reserveSeats = reserve.seatNo; 
                let tickets=reserve.tickets
                console.log(reserveSeats)
                let filteredmatch = matchSeats.filter(function(value, index, arr){ 
                    return value != seat;
                });
                let count=0;
                let desiredRow
                while(count<tickets.length){
                    if(tickets[count][0]==seat){
                        desiredRow=count
                        break;
                    }
                    count++;
                }
                let updatedTickets=deleteRow(tickets,count+1)
                const modifiedMatch = await Match.updateOne({MatchID: matchID},{seats: filteredmatch});
                let filteredreserve= reserveSeats.filter(function(value, index, arr){ 
                    return value != seat;
                });
                if (filteredreserve.length == 0){

                const modifiedReserve = await Reservation.remove({seatNo: seat });
                }else{
                const modifiedReserve = await Reservation.updateOne({seatNo: seat },{seatNo: filteredreserve,tickets:updatedTickets});
                }
                return res.status(200).json({
                    message: "your cancelation is done"
                   });
             }else{
                return res.status(404).json({ message:"you cannot cancel the reservation" });
            }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};

exports.getTickets=async(req,res)=>{
    const decodedID = getOID(req);
    const tickets=await Reservation.find({user:decodedID},{_id:0,tickets:1})

    return res.status(200).json({"tickets":tickets})

};