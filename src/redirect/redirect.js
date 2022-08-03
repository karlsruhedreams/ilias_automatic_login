const queryParams = new URLSearchParams(window.location.search);
const param = queryParams.get("redirectUrl");

if (param != null) {
    const redirectUrl = decodeURIComponent(param); // decode the redirect URL specified as a parameter

    console.log("ILIAS automatic login: redirect found");
    
    // save the redirect URL in the local storage for redirecting to it after login (session storage is not available)
    browser.storage.local.set({
        redirectUrl
    }).then(() => { },
        () => { console.log("ILIAS automatic login: failed to save redirect URL"); })
        .then(function () {
            window.location.href = redirectUrl; // also, visit the URL to start the login process
        });
} else {
    browser.storage.local.remove("redirectUrl");
    
    // if no redirect parameter was set, the user might have created a false redirect URL;
    // redirect them to the page with which they can create redirects
    
}