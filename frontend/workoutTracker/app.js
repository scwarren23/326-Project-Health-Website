document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("input");
    const activityInput = document.getElementById("activity");
    const durationInput = document.getElementById("duration");
    const distanceInput = document.getElementById("distance");
    const rpeInput = document.getElementById("rpe");
    const notesInput = document.getElementById("notes");

    const workoutHistory = document.getElementById("workout-history");
    console.log(workoutHistory);

    const totalDurationElem = document.getElementById("total-duration");
    const totalDistanceElem = document.getElementById("total-distance");
    const averageRpeElem = document.getElementById("average-rpe");

    const workouts = [];

    const errors = {
        activity: document.getElementById("activity-error"),
        duration: document.getElementById("duration-error"),
        distance: document.getElementById("distance-error"),
        rpe: document.getElementById("rpe-error"),
        notes: document.getElementById("notes-error")
    };

    function updateSummary() {
        let totalDuration = 0;
        let totalDistance = 0;
        let totalRpe = 0;

        workouts.forEach(workout => {
            totalDuration += workout.duration;
            totalDistance += workout.distance;
            totalRpe += workout.rpe;
        });

        const averageRpe = totalRpe / workouts.length;
        totalDurationElem.textContent = `Duration: ${Math.floor(totalDuration / 60)} hours ${totalDuration % 60} min`;
        totalDistanceElem.textContent = `Total Distance: ${totalDistance} miles`;
        averageRpeElem.textContent = `Average RPE: ${averageRpe.toFixed(2)}`;
    }

    //if (workoutHistory.children.length === 1 && workoutHistory.children[0].innerText.includes("_")) {
    //    workoutHistory.innerHTML = "";
    //}

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const activity = activityInput.value;
        const duration = parseFloat(durationInput.value.trim());
        const distance = parseFloat(distanceInput.value.trim());
        const rpe = parseFloat(rpeInput.value.trim());
        const notes = notesInput.value.trim();

        console.log(activity, duration, distance, rpe, notes);

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

        workoutHistory.appendChild(workoutItem);
        console.log("Form submitted");

        workouts.push({
            activity: activity,
            duration: duration,
            distance: distance,
            rpe: rpe,
            notes: notes,
        });
        updateSummary();

        form.reset();
    });
    
});