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

    const fields = {
        name: document.getElementById("name"),
        email: document.getElementById("email"),
        height: document.getElementById("height"),
        weight: document.getElementById("weight"),
        goal: document.getElementById("goal-weight"),
        dob: document.getElementById("dob"),
        gender: document.getElementById("gender"),
        activity: document.getElementById("activity-level")
    };

    const formElements = Object.values(fields);

    const validateField = (fieldName) => {
        const value = fields[fieldName].value.trim();
        const errorEl = errors[fieldName];
        errorEl.textContent = "";

        switch (fieldName) {
            case "name":
                if (!value) errorEl.textContent = "Name is required.";
                break;
            case "email":
                if (!value) errorEl.textContent = "Email is required.";
                else if (!/^\S+@\S+\.\S+$/.test(value)) errorEl.textContent = "Enter a valid email address.";
                break;
            case "height":
            case "weight":
            case "goal":
                if (!value) errorEl.textContent = "This field is required.";
                else if (Number(value) <= 0) errorEl.textContent = "Must be a positive number.";
                break;
            case "dob":
                if (!value) errorEl.textContent = "Date of birth is required.";
                break;
            case "gender":
                if (!fields[fieldName].value) errorEl.textContent = "Please select a gender.";
                break;
            case "activity":
                if (!fields[fieldName].value) errorEl.textContent = "Please select an activity level.";
                break;
        }
    };

    const validateForm = () => {
        let valid = true;
        Object.keys(fields).forEach(field => {
            validateField(field);
            if (errors[field].textContent) valid = false;
        });
        return valid;
    };

    // Attach real-time validation
    Object.keys(fields).forEach(field => {
        const el = fields[field];
        const eventType = el.tagName === "SELECT" ? "change" : "input";
        el.addEventListener(eventType, () => validateField(field));
    });

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

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const isValid = validateForm();
        if (!isValid) return;

        

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