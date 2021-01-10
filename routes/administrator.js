const express = require("express");
const router = express.Router();

const AdministratorController = require('../controllers/administratorController');

router.get('/getRequests',AdministratorController.getAllRequests);


module.exports = router;