const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Get inventory item's detail by inventory_id
 * ************************** */
async function getInventoryDetailByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorydetailbyinventoryid error " + error)
  }
}


/* *****************************
*   Add new classification
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add new inventory
* *************************** */
async function addInventory(
  inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing classification name
 * ********************* */
async function checkExistingClassificationName(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classificationName = await pool.query(sql, [classification_name])
    return classificationName.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id])
    // console.log(data)
    return data.rowCount > 0
  } catch (error) {
    new Error("Delete Inventory Error")
    return false
  }
}

/* *****************************
*   Search inventory
* *************************** */
async function searchInventory(
  classification_id,
  inv_price_min,
  inv_price_max,
  inv_year_min,
  inv_year_max,
  inv_miles_min,
  inv_miles_max,
){
  try {
    const sql = "SELECT * FROM public.inventory WHERE ($1::int IS NULL OR classification_id = $1) AND ($2::numeric IS NULL OR inv_price >= $2) AND ($3::numeric IS NULL OR inv_price <= $3) AND ($4::int IS NULL OR inv_year::int >= $4) AND ($5::int IS NULL OR inv_year::int <= $5) AND ($6::int IS NULL OR inv_miles >= $6) AND ($7::int IS NULL OR inv_miles <= $7) "
    const result = await pool.query(sql, [
      classification_id,
      inv_price_min,
      inv_price_max,
      inv_year_min,
      inv_year_max,
      inv_miles_min,
      inv_miles_max,
    ]);
    return result;
  } catch (error) {
    return error.message
  }
}


module.exports = { getClassifications, getInventoryByClassificationId, getInventoryDetailByInventoryId, 
  addClassification, addInventory, checkExistingClassificationName, updateInventory, deleteInventory,
  searchInventory }