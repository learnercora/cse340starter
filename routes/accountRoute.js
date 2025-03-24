// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
//
router.post('/register', utilities.handleErrors(accountController.registerAccount))


module.exports = router;