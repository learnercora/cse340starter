// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
//建立會員 view
router.post("/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// management view
router.get(
  "/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildManagement)
)

// Process the logout attempt
router.post(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

router.get("/logout", accountController.accountLogout)

// edit account view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildEditAccount)
)

module.exports = router;