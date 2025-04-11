document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");
    const form = document.querySelector(".account-form");

    const errors = {
        height: document.getElementById("height-error"),
        weight: document.getElementById("weight-error"),
        goal: document.getElementById("goal-error"),
        gender: document.getElementById("gender-error"),
        activity: document.getElementById("activity-error"),
        name: document.getElementById("name-error"),
        email: document.getElementById("email-error"),
        dob: document.getElementById("dob-error")
    };

    const formElements = [
        "name", "email", "height", "weight",
        "goal-weight", "dob", "gender", "activity-level"
    ].map(id => document.getElementById(id));

    editButton.addEventListener("click", () => {
        formElements.forEach(el => {
            if (el.tagName === "SELECT") {
                el.disabled = false;
            } else {
                el.readOnly = false;
            }
        });
        saveButton.disabled = false;
    });

    document.querySelector(".account-form").addEventListener("submit", (e) => {
        e.preventDefault();

        Object.values(errors).forEach(el => el.textContent = "");

        

        formElements.forEach(el => {
            if (el.tagName === "SELECT") {
                el.disabled = true;
            } else {
                el.readOnly = true;
            }
        });
        saveButton.disabled = true;
    })
})