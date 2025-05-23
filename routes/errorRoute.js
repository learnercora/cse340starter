// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

router.get("/", utilities.handleErrors(errorController.triggerError));

module.exports = router;