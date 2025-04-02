const form1 = document.querySelector("#updateAccForm1")
const form2 = document.querySelector("#updateAccForm2")

form1.addEventListener("change", function () {
  const updateBtn = document.querySelector("#updateAccForm1 button")
  updateBtn.removeAttribute("disabled")
})
form2.addEventListener("change", function () {
  const updateBtn = document.querySelector("#updateAccForm2 button")
  updateBtn.removeAttribute("disabled")
})