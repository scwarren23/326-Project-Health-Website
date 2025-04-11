document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("input");
    const activityInput = document.getElementById("activity");
    const durationInput = document.getElementById("duration");
    const distanceInput = document.getElementById("distance");
    const rpeInput = document.getElementById("rpe");
    const notesInput = document.getElementById("notes");

    const errors = {
        activity: document.getElementById("activity-error"),
        duration: document.getElementById("duration-error"),
        distance: document.getElementById("distance-error"),
        rpe: document.getElementById("rpe-error"),
        notes: document.getElementById("notes-error")
    };

    if (workoutHistory.children.length === 1 && workoutHistory.children[0].innerText.includes("_")) {
        workoutHistory.innerHTML = "";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const activity = activityInput.value;
        const duration = durationInput.value.trim();
        const distance = distanceInput.value.trim();
        const rpe = rpeInput.value.trim();
        const notes = notesInput.value.trim();

        if (duration === ""|| rpe === "") {
            alert("Please fill out all required fields (duration and RPE)");
            return;
        }

        const workoutItem = document.createElement("li");
        const date = new Date().toLocaleDateString();

        workoutItem.innerHTML = `
            <strong>${date}</strong><br />
            <strong>Activity:</strong> ${activity}<br />
            <strong>Duration:</strong> ${duration} min<br />
            <strong>Distance:</strong> ${distance} miles<br />
            <strong>RPE:</strong> ${rpe}<br />
            <strong>Notes:</strong> ${notes ? notes : "None"}<br />
        `;

        // Add the new workout to the history list
        workoutHistory.appendChild(workoutItem);

        // Reset the form
        form.reset();
    });

});