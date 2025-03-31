const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data?data[0].classification_name:null
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail by inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryDetailByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryDetailGrid(data)
  let nav = await utilities.getNav()
  const v = data[0]
  const titleName = `${v.inv_year} ${v.inv_make} ${v.inv_model}`
  res.render("./inventory/inventoryDetail", {
    title: titleName,
    nav,
    grid,
  })
}


/* ***************************
 *  Build Management view (week4 assignment)
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Management",
    nav,
  })
}
/* ***************************
 *  Delivery add classification view(week4 assignment)
 * ************************** */
invCont.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}
/* ****************************************
*  Process add classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  // let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name} successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding classification failed.")
    res.status(501).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Delivery add inventory view(week4 assignment)
 * ************************** */
invCont.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null
  })
}
/* ****************************************
*  Process add inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  
  const addResult = await invModel.addInventory(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    parseFloat(inv_price), 
    parseInt(inv_miles), 
    inv_color, 
    parseInt(classification_id)
  )

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${inv_make} ${inv_model} successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding inventory failed.")
    res.status(501).render("inventory/management", {
      title: "Management",
      nav,
      errors: null
    })
  }
}


module.exports = invCont

// NOTE:
// res.render(view, data) 的結構
// view：指定要渲染的 模板檔案（不需要寫副檔名，Express 會自動找 .ejs, .pug, .hbs）。
// data：傳遞給模板的 變數物件，讓模板可以使用這些資料。