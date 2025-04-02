// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accValidate = require('../utilities/account-validation')

// login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));
//建立會員 view
router.post("/register", 
    accValidate.registationRules(),
    accValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    accValidate.loginRules(),
    accValidate.checkLoginData,
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
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccount)
)
router.post("/update/", 
  utilities.checkLogin, 
  accValidate.accountRules(),
  accValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount)
)
router.post("/update-password", 
  utilities.checkLogin, 
  accValidate.passwordRules(),
  accValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;