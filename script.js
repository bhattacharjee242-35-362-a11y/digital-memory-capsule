

const messageBox = document.getElementById("message");
const dateInput = document.getElementById("date");
const result = document.getElementById("result");
const charCount = document.getElementById("charCount");
const characterCounter = document.getElementById("characterCounter");


// ----------------------------------------
// Set Minimum Date
// ----------------------------------------

function getToday() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

dateInput.min = getToday();


// ----------------------------------------
// Character Counter
// ----------------------------------------

messageBox.addEventListener("input", function () {

    const length = messageBox.value.length;

    charCount.textContent = length;

    characterCounter.classList.remove(
        "warning",
        "danger"
    );

    if (length >= 500) {

        characterCounter.classList.add("danger");

    } else if (length >= 450) {

        characterCounter.classList.add("warning");

    }

});


// ----------------------------------------
// Save Capsule
// ----------------------------------------

function saveCapsule() {

    const message =
        messageBox.value.trim();

    const date =
        dateInput.value;


    // Check empty fields

    if (message === "" || date === "") {

        showResult(
            "Please write a message and select a date.",
            "error"
        );

        return;
    }


    // Prevent past date

    if (date < getToday()) {

        showResult(
            "Please select today or a future date.",
            "error"
        );

        return;
    }


    // Create capsule object

    const capsule = {

        message: message,

        date: date,

        createdAt: new Date().toISOString()

    };


    // Save capsule

    localStorage.setItem(
        "memoryCapsule",
        JSON.stringify(capsule)
    );


    // Show capsule

    showCapsule();

}


// ----------------------------------------
// Show Capsule
// ----------------------------------------

function showCapsule() {

    const savedCapsule =
        localStorage.getItem("memoryCapsule");


    // No capsule found

    if (!savedCapsule) {

        return;

    }


    let capsule;

    try {

        capsule =
            JSON.parse(savedCapsule);

    } catch (error) {

        console.error(
            "Invalid capsule data.",
            error
        );

        localStorage.removeItem(
            "memoryCapsule"
        );

        return;

    }


    const message =
        capsule.message;

    const date =
        capsule.date;


    // Check if capsule exists

    if (!message || !date) {

        return;

    }


    // Current date/time

    const today =
        new Date();


    // Unlock date

    const unlockDate =
        new Date(date + "T00:00:00");


    // ------------------------------------
    // Capsule Unlocked
    // ------------------------------------

    if (today >= unlockDate) {

        result.innerHTML = "";

        const title =
            document.createElement("h2");

        title.textContent =
            "🎉 Capsule Unlocked!";

        const messageElement =
            document.createElement("p");

        messageElement.textContent =
            "💌 " + message;

        result.appendChild(title);

        result.appendChild(messageElement);

        result.className =
            "result success";


        // Show date

        const dateElement =
            document.createElement("small");

        dateElement.textContent =
            "Unlocked on " +
            formatDate(date);

        result.appendChild(dateElement);


    }

    // ------------------------------------
    // Capsule Still Locked
    // ------------------------------------

    else {

        result.innerHTML = "";

        const title =
            document.createElement("h2");

        title.textContent =
            "🔒 Capsule Locked";

        const dateElement =
            document.createElement("p");

        dateElement.textContent =
            "Unlock Date: " +
            formatDate(date);

        const countdownElement =
            document.createElement("p");

        countdownElement.id =
            "capsuleCountdown";

        result.appendChild(title);

        result.appendChild(dateElement);

        result.appendChild(countdownElement);

        result.className =
            "result locked";


        updateCountdown(date);

    }

}


// ----------------------------------------
// Format Date
// ----------------------------------------

function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


// ----------------------------------------
// Countdown
// ----------------------------------------

function updateCountdown(dateString) {

    const countdown =
        document.getElementById(
            "capsuleCountdown"
        );


    if (!countdown) {

        return;

    }


    function update() {

        const now =
            new Date();

        const unlockDate =
            new Date(
                dateString + "T00:00:00"
            );

        const difference =
            unlockDate - now;


        // Already unlocked

        if (difference <= 0) {

            showCapsule();

            return;

        }


        const days =
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            );


        if (days === 1) {

            countdown.textContent =
                "⏳ 1 day remaining";

        } else {

            countdown.textContent =
                `⏳ ${days} days remaining`;

        }

    }


    update();

    setInterval(
        update,
        60000
    );

}


// ----------------------------------------
// Result Message
// ----------------------------------------

function showResult(
    message,
    type = "error"
) {

    result.textContent =
        message;

    result.className =
        `result ${type}`;

}


// ----------------------------------------
// Load Saved Capsule
// ----------------------------------------

function loadCapsule() {

    const savedCapsule =
        localStorage.getItem(
            "memoryCapsule"
        );


    if (!savedCapsule) {

        return;

    }


    try {

        const capsule =
            JSON.parse(savedCapsule);


        // Put saved data back into form

        messageBox.value =
            capsule.message || "";

        dateInput.value =
            capsule.date || "";


        // Update character count

        charCount.textContent =
            messageBox.value.length;


        // Show capsule

        showCapsule();

    } catch (error) {

        console.error(
            "Could not load capsule.",
            error
        );

    }

}


// ----------------------------------------
// Start Application
// ----------------------------------------

loadCapsule();
