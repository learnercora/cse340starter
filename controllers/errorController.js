const errorController = {}

errorController.triggerError = async function(req, res, next){
  const error = new Error("500 Error!");
  // error.status = 500;
  next(error);
}
// NOTE: (line6)
// res.render(view, data) 的結構
// view：指定要渲染的 模板檔案（不需要寫副檔名，Express 會自動找 .ejs, .pug, .hbs）。
// data：傳遞給模板的 變數物件，讓模板可以使用這些資料。

module.exports = errorController