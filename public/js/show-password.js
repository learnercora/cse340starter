
const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function() {
    const pwsdInput = document.getElementById("account_password");
    const type = pwsdInput.getAttribute("type");
    if (type === "password") {
        pwsdInput.setAttribute("type","text");
        pswdBtn.innerHTML = "Hide Password";
    } else {
        pwsdInput.setAttribute("type","password");
        pswdBtn.innerHTML = "Show Password";
    }
});