function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

/// Checks if the login form is filled, and if so, submits the credentials
function checkFormFilled(previousFilledState) {
    const realisticTypingLength = 5; // the number of characters we can expect the user to have entered between two checks

    const usernameLength = document.getElementById("name").value.length;
    const passwordLength = document.getElementById("password").value.length;
    const previousUsernameLength = previousFilledState?.usernameLength ?? 0;
    const previousPasswordLength = previousFilledState?.passwordLength ?? 0;

    if (previousUsernameLength === 0 && previousPasswordLength === 0) {
        // If no data was entered and now both fields have text, it must be a password manager
        if (usernameLength > 0 && passwordLength > 0) {
            return {
                isPasswordManagerDetected: true,
                isManualDetected: false
            };
        }

        // If no data was entered and now in one of the fields there is short text that the user could have typed in in such a short time, it must be manual credential entry
        if ((usernameLength > 0 && usernameLength <= realisticTypingLength) !== (passwordLength > 0 && passwordLength <= realisticTypingLength)) {
            return {
                isPasswordManagerDetected: false,
                isManualDetected: true
            };
        }
    } else {
        // If there was text in either fields but now it's longer, that must be manual credential entry
        if ((previousUsernameLength > 0 && usernameLength > previousUsernameLength)
            !== (previousPasswordLength > 0 && passwordLength > previousPasswordLength)) {
            return {
                isPasswordManagerDetected: false,
                isManualDetected: true
            };
        }

        // If a field which had text in it did not change but the other which was empty has more text than what the user could have typed in,
        // it must be a password manager filling fields with a delay between the fields
        if ((
            usernameLength > 0
            && previousUsernameLength === usernameLength
            && previousPasswordLength === 0
            && passwordLength > realisticTypingLength
        ) || (
                passwordLength > 0
                && previousPasswordLength === passwordLength
                && previousUsernameLength === 0
                && usernameLength > realisticTypingLength
            )) {
            return {
                isPasswordManagerDetected: true,
                isManualDetected: false
            };
        }
    }

    // If no clear sign of either a password manager or manual entry, just save how much text was in the fields and wait another cycle
    return {
        isPasswordManagerDetected: false,
        isManualDetected: false,
        usernameLength,
        passwordLength
    };
}

function tryLoggingIn() {
    const submitButton = document.getElementById("sbmt");

    if (!submitButton) {
        console.warn("ILIAS automatic login: login button was not found");

        return;
    }

    function logIn() {
        console.log("ILIAS automatic login: logging in");

        submitButton.click();
    }

    // Check a few times if the form is filled by a password manager, or if the user is manually entering credentials
    const sleepDuration = 300;
    const resolveOnceDetected = () => {
        const result = checkFormFilled();

        return result.isPasswordManagerDetected || result.isManualDetected
            ? Promise.resolve(result)
            : Promise.reject(result);
    }

    let task = resolveOnceDetected();

    for (let i = 0; i < 20; i++) {
        task = task
            .then(undefined,
                async (r) => {
                    await sleep(sleepDuration);
                    return Promise.reject(r);
                }
            ).then(undefined,
                (r) => resolveOnceDetected(r)
            );
    }

    task.then(
        (r) => {
            if (r.isPasswordManagerDetected)
                logIn();
            else if (r.isManualDetected)
                console.log("ILIAS automatic login: manually entered credentials detected - waiting for user to proceed with login");
        },
        () => {
            browser.storage.local.remove("redirectData");
            
            console.log("ILIAS automatic login: logging in timeouted, possible redirects cancelled");
        }
    );
}

tryLoggingIn();