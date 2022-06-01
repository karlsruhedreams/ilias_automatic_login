// Choose normal account type on the account type Ilias page
var accountButton = document.getElementById("button_shib_login");
if (accountButton != null) {
    accountButton.click();
} else {
    // If we're not on the account type page, initiate the login on an Ilias page
    var submitButton = document.querySelector("button > span[aria-label=\"Anmelden\"]");
    submitButton?.parentElement.click();
}