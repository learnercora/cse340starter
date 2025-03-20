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
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
// NOTE: (line15-19)
// res.render(view, data) 的結構
// view：指定要渲染的 模板檔案（不需要寫副檔名，Express 會自動找 .ejs, .pug, .hbs）。
// data：傳遞給模板的 變數物件，讓模板可以使用這些資料。

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

module.exports = invCont