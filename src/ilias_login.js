const submitButton = document.getElementById("sbmt");

function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

/// Checks if the login form is filled, and if so, submits the credentials
function checkFormFilled() {
    var filled = document.getElementById("password").value ? true : false;
    if (filled) {
        console.log("ILIAS automatic login: logging in");

        submitButton.click();
    }

    return filled;
}

function login() {
    if (!submitButton) {
        console.warn("ILIAS automatic login: login button was not found");
        
        return;
    }
    
    // Check a few times if the form is filled by a password manager
    const sleepDuration = 300;
    const rejectOnceFilled = () => checkFormFilled() ? Promise.reject() : Promise.resolve();
    
    let task = rejectOnceFilled();

    for (let i = 0; i < 4; i++) {
        task = task
            .then(async () => await sleep(sleepDuration))
            .then(() => rejectOnceFilled());
    }
    task.then(() => browser.storage.local.remove("redirectUrl"));
}

login();