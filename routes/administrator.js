const express = require("express");
const router = express.Router();

const AdministratorController = require('../controllers/administratorController');

router.get('/getRequests',AdministratorController.getAllRequests);
router.post('/approve/:username',AdministratorController.approveRequest);
router.get('/getUsers',AdministratorController.getAllUsers);
router.post('/remove/:id',AdministratorController.removeUser);




module.exports = router;