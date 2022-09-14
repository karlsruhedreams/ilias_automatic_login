const redirectExpirySeconds = 120;

async function checkRedirect() {
    // read and remove the URL from storage to redirect to
    const sessionStorageRedirectKey = "redirectData";
    const redirect = await browser.storage.local.get(sessionStorageRedirectKey)
        .then(s => s?.redirectData, () => undefined);
    await browser.storage.local.remove(sessionStorageRedirectKey);

    if (redirect != null && redirect.url != null && (Date.now() / 1000 - redirect.time < redirectExpirySeconds)) {
        console.log("ILIAS automatic login: redirecting to redirect URL");

        window.location.href = redirect.url;

        return true;
    } else {
        if (redirect?.time == null)
            console.log("ILIAS automatic login: no redirect URL was found");
        else
            console.log("ILIAS automatic login: only expired redirect URL was found");

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
        var submitButton = document.querySelector("span[aria-label=\"Anmelden\"]");

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
}