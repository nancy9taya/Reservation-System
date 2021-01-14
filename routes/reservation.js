const express = require("express");
const router = express.Router();

const reservationController = require('../controllers/reservationControllers');
const checkAuth = require('../middleware/checkAuth');

router.post("/add/:id",checkAuth,  reservationController.reserveSeat);
router.get("/cancel/:id",checkAuth,  reservationController.CancelSeat);
//router.get("/viewAll",checkAuth,  reservationController.viewAll);

module.exports = router;