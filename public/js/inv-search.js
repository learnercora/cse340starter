
const form = document.querySelector("#searchInvForm")

form.addEventListener("change", function () {
  const searchBtn = document.querySelector("#searchInvForm button")
  searchBtn.removeAttribute("disabled")
})