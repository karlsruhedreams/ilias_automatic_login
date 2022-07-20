const queryParams = new URLSearchParams(window.location.search);
const param = queryParams.get("redirectUrl");

if (param != null) {
    const redirectUrl = decodeURIComponent(param); // decode the redirect URL specified as a parameter

    // save the redirect URL in the local storage for redirecting to it after login (session storage is not available)
    browser.storage.local.set({
        redirectUrl
    }).then(s => { }, f => { console.log("ILIAS automatic login: failed to save redirect URL") })
        .then(function () {
            window.location.href = redirectUrl; // also, visit the URL to start the login process
        });

} else {
    browser.storage.local.remove("redirectUrl");
    
    // if no redirect parameter was set, the user just visited this document;
    // the how-to description of creating redirects is shown in this case
    const visibleDisplay = document.getElementById("redirecting").style.display;
    document.getElementById("redirecting").style.display = "none";
    document.getElementById("howto").style.display = visibleDisplay;

    document.getElementById("inputUrl").addEventListener("input", function () {
        const button = document.getElementById("create");

        button.disabled = !this.value;
    })

    document.getElementById("create").addEventListener("click", async function () {
        const input = document.getElementById("inputUrl").value;
        const output = document.getElementById("output");

        if (!input) {
            output.innerText = "No text was entered to use as a redirect URL";
            output.style.color = "darkred";

            return;
        }

        const urlPrefix = "moz-extension://";
        if (!window.location.origin.startsWith(urlPrefix)) {
            output.innerText = "Could not get internal UUID of extension";
            output.style.color = "darkred";

            return;
        }

        const extensionUuid = window.location.host; // infer the internal UUID of the extension from the current URL

        const created = `moz-extension://${extensionUuid}/redirect.html?redirectUrl=${encodeURIComponent(input)}`;

        output.innerText = created;
        output.style.color = "darkgreen";
        await navigator.clipboard.writeText(created);
    });
}