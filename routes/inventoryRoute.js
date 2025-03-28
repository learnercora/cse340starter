// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// inventory detail
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
// management view
router.get("/", utilities.handleErrors(invController.managementLinks));
// add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", 
    invValidate.classificationRules(),
    invValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
)
// add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
)


module.exports = router;