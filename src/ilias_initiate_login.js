async function checkRedirect() {
    // read and remove the URL from storage to redirect to
    const sessionStorageRedirectKey = "redirectUrl";
    const redirectUrl = await browser.storage.local.get(sessionStorageRedirectKey)
        .then(s => s?.redirectUrl, () => undefined);
    await browser.storage.local.remove(sessionStorageRedirectKey);

    if (redirectUrl != null) {
        console.log("ILIAS automatic login: redirecting to redirect URL");

        window.location.href = redirectUrl;

        return true;
    } else {
        console.log("ILIAS automatic login: no redirect URL was found");

        return false;
    }
}

async function checkLogin(retryIfUnsuccessful = true) {
    // Choose normal account type on the account type Ilias page
    var accountButton = document.getElementById("button_shib_login");
    if (accountButton != null) {
        accountButton.click();
    } else {
        // If we're not on the account type page, initiate the login on an Ilias page
        var submitButton = document.querySelector("button > span[aria-label=\"Anmelden\"]");

        if (submitButton) {
            console.log("ILIAS automatic login: initiating login");

            const preRedirectUrl = window.location.href;
            submitButton.parentElement.click();

            // Check if Ilias itself actually has redirected;
            // if not, try the login again
            new Promise(resolve => setTimeout(resolve, 500))
                .then(async () => {
                    if (window.location.href === preRedirectUrl && retryIfUnsuccessful)
                        await checkLogin(false);
            });

        } else {
            // If no login button is found, that suggests that we are logged in. Check if there is an url saved for redirecting to
            checkRedirect()
                .then(async (isRedirectFound) => {
                    console.log(`CHECKING AGAIN: ${isRedirectFound}`);
                    
                    // If no redirect was found, try looking for a login again
                    if (!isRedirectFound && retryIfUnsuccessful) {
                        new Promise(resolve => setTimeout(resolve, 500))
                            .then(async () => await checkLogin(false));
                    }
                });
        }
    }
}

if (!window.location.href.startsWith("https://ilias.studium.kit.edu/redirect")) {
    checkLogin();
   //setTimeout(checkLogin, 1000);
}