const express = require("express");
const router = express.Router();

const stadiumController = require('../controllers/stadiumControllers');
const checkAuth = require('../middleware/checkAuth');

router.post("/create",checkAuth,  stadiumController.createStadium);
router.get("/getAll",checkAuth,  stadiumController.getAllStdiums);

module.exports = router;
