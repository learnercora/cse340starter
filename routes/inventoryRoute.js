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
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement));
// add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification",
    utilities.checkAccountType, 
    invValidate.classificationRules(),
    invValidate.checkAddClassificationData,
    utilities.handleErrors(invController.addClassification)
)
// add inventory
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));
router.post("/add-inventory", 
    utilities.checkAccountType, 
    invValidate.inventoryRules(),
    invValidate.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory)
)
//getInventory
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))

//edit inventory
router.get("/edit/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventory));
router.post("/update/", 
    utilities.checkAccountType, 
    invValidate.inventoryRules(),
    invValidate.checkUpdateInventoryData,
    utilities.handleErrors(invController.updateInventory)
)

//delete inventory
router.get("/delete/:inventory_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventory));
router.post("/delete/", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))



module.exports = router;