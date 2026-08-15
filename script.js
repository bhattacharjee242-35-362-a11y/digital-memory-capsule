function saveCapsule() {

    let message = document.getElementById("message").value;
    let date = document.getElementById("date").value;

    if (message == "" || date == "") {
        document.getElementById("result").innerHTML =
            "Please write a message and select a date.";

        return;
    }

    localStorage.setItem("message", message);
    localStorage.setItem("date", date);

    showCapsule();
}


function showCapsule() {

    let message = localStorage.getItem("message");
    let date = localStorage.getItem("date");

    if (message == null || date == null) {
        return;
    }

    let today = new Date();
    let unlockDate = new Date(date);

    if (today >= unlockDate) {

        document.getElementById("result").innerHTML =
            "<h2>🎉 Capsule Unlocked!</h2>" +
            "<p>💌 " + message + "</p>";

    } else {

        document.getElementById("result").innerHTML =
            "<h2>🔒 Capsule Locked</h2>" +
            "<p>Unlock Date: " + date + "</p>";
    }
}


showCapsule();