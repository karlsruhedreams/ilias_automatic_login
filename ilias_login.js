var submitButton = document.getElementById("sbmt");

function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

/// Checks if the login form is filled, and if so, submits the credentials
function checkFormFilled() {
    var filled = document.getElementById("password").value ? true : false;
    if (filled)
        submitButton?.click();

    return filled;
}

// Check a few times if the form is filled by a password manager
const sleepDuration = 300;
sleep(sleepDuration)
    .then(() => !checkFormFilled())
    .then(async () => await sleep(sleepDuration))
    .then(() => !checkFormFilled())
    .then(async () => await sleep(sleepDuration))
    .then(() => !checkFormFilled());