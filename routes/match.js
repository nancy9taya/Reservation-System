const express = require("express");
const router = express.Router();

const MatchController = require('../controllers/matchControllers');

router.post("/newEvent", MatchController.CreateNewEvent);
router.post('/editEvent/:id',MatchController.EditExistingEvent);
router.get('/matchDetails/:id',MatchController.EditExistingEvent);


module.exports = router;