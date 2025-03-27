const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
*  Add classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return [
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("New classification name cannot be empty or contain a space or special character of any kind.")
        .custom(async (classification_name) => {
            const classificationNameExists = await invModel.checkExistingClassificationName(classification_name)
            if (classificationNameExists){
              throw new Error("Classification name exists. Please use different one.")
            }
        }),
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        // console.log(errors)
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "ADD Classification",
            nav,
            classification_name
      })
      return
    }
    next()
}

/*  **********************************
*  add inventory Data Validation Rules
* ********************************* */
validate.inventoryRules = () => {
    return [
      body("classification_id")
        .trim()
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage("No empty."),
      body("inv_make")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Must be at least 3 characters long."),
      body("inv_model")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Must be at least 3 characters long."),
      body("inv_description")
        .trim()
        .notEmpty()
        .withMessage("No empty."),
      body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("No empty."),
      body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("No empty."),
      body("inv_price")
        .trim()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Only decimal or integer."),
      body("inv_year")
        .trim()
        .notEmpty()
        .isInt({min: 1900, max: 2099})
        .withMessage("Year must between 1900 to 2099."),
      body("inv_miles")
        .trim()
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage("Only digits."),
      body("inv_color")
        .trim()
        .notEmpty()
        .withMessage("No empty."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        classificationList,
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
      })
      return
    }
    next()
}
  
  
module.exports = validate