const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildGrid(data)
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect
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
  const classificationSelect = await utilities.buildClassificationList()

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name} successfully.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    req.flash("notice", "Sorry, adding classification failed.")
    res.status(501).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect
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
  const classificationSelect = await utilities.buildClassificationList()

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
      errors: null,
      classificationSelect
    })
  } else {
    req.flash("notice", "Sorry, adding inventory failed.")
    res.status(501).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const _itemData = await invModel.getInventoryDetailByInventoryId(inv_id)
  const itemData = _itemData[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const _itemData = await invModel.getInventoryDetailByInventoryId(inv_id)
  const itemData = _itemData[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body
  const deleteResult = await invModel.deleteInventory(parseInt(inv_id))
  const itemName = `${inv_make} ${inv_model}`
  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    })
  }
}

/* ***************************
 *  Build search inventory view
 * ************************** */
invCont.buildSearchInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(null, false)
  res.render("./inventory/search-inventory", {
    title: "Search Vehicles",
    nav,
    errors: null,
    classificationList
  })
}

/* ***************************
 *  Search Inventory Data
 * ************************** */
invCont.searchInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let {
    classification_id,
    inv_price_min,
    inv_price_max,
    inv_year_min,
    inv_year_max,
    inv_miles_min,
    inv_miles_max,
  } = req.body

  classification_id = parseInt(classification_id) || null
  inv_price_min = parseFloat(inv_price_min) || null
  inv_price_max = parseFloat(inv_price_max) || null
  inv_year_min = parseInt(inv_year_min) || null
  inv_year_max = parseInt(inv_year_max) || null
  inv_miles_min = parseInt(inv_miles_min) || null
  inv_miles_max = parseInt(inv_miles_max) || null

  const searchResult = await invModel.searchInventory(
      classification_id,
      inv_price_min,
      inv_price_max,
      inv_year_min,
      inv_year_max,
      inv_miles_min,
      inv_miles_max
  )

  if (searchResult&&searchResult.rows) {
    if(searchResult.rows.length>0){
      req.flash("notice", `Search successfully.`)
      const grid = await utilities.buildGrid(searchResult.rows)
      let nav = await utilities.getNav()
      res.render("./inventory/classification", {
        title: "Search vehicles",
        nav,
        grid,
      })
    }else{
      req.flash("notice", "Sorry, no data.")
      const classificationSelect = await utilities.buildClassificationList(classification_id, false)
      res.status(501).render("inventory/search-inventory", {
        title: "Search Vehicles",
        nav,
        classificationList: classificationSelect,
        errors: null,
        inv_price_min,
        inv_price_max,
        inv_year_min,
        inv_year_max,
        inv_miles_min,
        inv_miles_max,
        classification_id
      })
    }
    
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id, false)
    req.flash("notice", "Sorry, search failed.")
    res.status(501).render("inventory/search-inventory", {
      title: "Search Vehicles",
      nav,
      classificationList: classificationSelect,
      errors: null,
      inv_price_min,
      inv_price_max,
      inv_year_min,
      inv_year_max,
      inv_miles_min,
      inv_miles_max,
      classification_id
    })
  }
}


module.exports = invCont

// NOTE:
// res.render(view, data) 的結構
// view：指定要渲染的 模板檔案（不需要寫副檔名，Express 會自動找 .ejs, .pug, .hbs）。
// data：傳遞給模板的 變數物件，讓模板可以使用這些資料。