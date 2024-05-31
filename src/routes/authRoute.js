const { Router } = require("express");
const authController = require("../controller/authController");

const router = Router();

router.get("/signup", authController.signupGet);
router.post("/signup", authController.signupPost);
router.get("/login", authController.loginGet); // usually triggered by a succesfull login
router.post("/login", authController.loginPost);
router.get("/logout", authController.logoutGet); // usually a button

module.exports = router;
