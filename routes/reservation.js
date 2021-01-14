const express = require("express");
const router = express.Router();

const reservationController = require('../controllers/reservationControllers');
const checkAuth = require('../middleware/checkAuth');

router.post("/add/:id",checkAuth,  reservationController.reserveSeat);
router.post("/cancel/:id",checkAuth,  reservationController.CancelSeat);
router.get("/tickets",checkAuth,  reservationController.getTickets);
//router.get("/viewAll",checkAuth,  reservationController.viewAll);

module.exports = router;