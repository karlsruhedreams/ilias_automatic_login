const queryParams = new URLSearchParams(window.location.search);
const param = queryParams.get("redirectUrl");

document.getElementById("create").addEventListener("click", async function () {
    async function displayMessage(text, color) {
        const duration = 1500;
        const btnCreate = document.getElementById("create");

        btnCreate.innerText = text;
        btnCreate.style.color = color;

        await new Promise(resolve => setTimeout(resolve, duration))
            .then(() => {
                btnCreate.innerText = "Copy";
                btnCreate.style.color = "";
            });
    }
    async function displaySuccess(text) {
        await displayMessage(text, "green");
    }
    async function displayError(text) {
        await displayMessage(text, "red");
    }

    // create URL
    navigator.clipboard.readText()
        .then(async (inputUrl) => {
            const url = "https://ilias.studium.kit.edu/redirect?redirectUrl=" + encodeURIComponent(inputUrl)
            await navigator.clipboard.writeText(url);
        })
        .then(async () => await displaySuccess("Copied!"),
            async () => await displayError("Error!"));
});