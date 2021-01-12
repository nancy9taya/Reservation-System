const express = require("express");
const router = express.Router();

const UserController = require('../controllers/userControllers');
const checkAuth = require('../middleware/checkAuth');

router.post("/signup", UserController.userSignup);
router.post("/login", UserController.userLogin);
router.delete("/:id",checkAuth, UserController.userDelete);
router.post("/logout" ,checkAuth,  UserController.userLogout);
router.post("/Edit" ,checkAuth,  UserController.userEdit);
router.get("/verify" , UserController.userVerifyMail);

module.exports = router;
