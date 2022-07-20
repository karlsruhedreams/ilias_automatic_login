async function checkRedirect() {
    // read and remove the URL from storage to redirect to
    const sessionStorageRedirectKey = "redirectUrl";
    const redirectUrl = await browser.storage.local.get(sessionStorageRedirectKey)
        .then(s => s?.redirectUrl, f => undefined);
    await browser.storage.local.remove(sessionStorageRedirectKey);

    if (redirectUrl != null) {
        console.log("ILIAS automatic login: redirecting to redirect URL");

        window.location.href = redirectUrl;
    } else {
        console.log("ILIAS automatic login: no redirect URL was found");
    }
}

// Choose normal account type on the account type Ilias page
var accountButton = document.getElementById("button_shib_login");
if (accountButton != null) {
    accountButton.click();
} else {
    // If we're not on the account type page, initiate the login on an Ilias page
    var submitButton = document.querySelector("button > span[aria-label=\"Anmelden\"]");

    if (submitButton) {
        console.log("ILIAS automatic login: initiating login");

        submitButton.parentElement.click();
    } else {
        // If no login button is found, that suggests that we are logged in. Check if there is an url saved for redirecting to
        checkRedirect().then(function () { });
    }
}