document.addEventListener("DOMContentLoaded", function () {
    // Implement functions to calculate recommended calorie totals, macros, etc 
    // based on the information input by the user
    const form = document.getElementById("nutritional-form");
    const goalWeightInput = document.getElementById("goal-weight-inpt");
    const curWeightInput = document.getElementById("weight-inpt");
    const activityLevelInput = document.getElementById("activity");
    const genderInput = document.getElementById("gender-inpt");
    const ageInput = document.getElementById("age-inpt");
    const heightInput = document.getElementById("height-inpt");
    const recommendationsDashboard = document.getElementById("reccomendations-dashboard");

    const errors = {
        age: document.getElementById("age-error"),
        height: document.getElementById("height-error"),
        weight: document.getElementById("weight-error"),
        goal: document.getElementById("goal-error"),
        gender: document.getElementById("gender-error"),
        activity: document.getElementById("activity-error")
    };
    
    const savedInputs = JSON.parse(localStorage.getItem("userInputs"));
    if (savedInputs) {
        goalWeightInput.value = savedInputs.goalWeight;
        curWeightInput.value = savedInputs.weight;
        ageInput.value = savedInputs.age;
        heightInput.value = savedInputs.height;
        genderInput.value = savedInputs.gender;
        activityLevelInput.value = savedInputs.activityLevel;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        Object.values(errors).forEach(el => el.textContent = "");

        const goalWeight = goalWeightInput.value;
        const age = ageInput.value;
        const height = heightInput.value;
        const weight = curWeightInput.value;
        const gender = genderInput.value;
        const activityLevel = activityLevelInput.value;

        let hasError = false;

        if (!age || age <= 0) {
            errors.age.textContent = "Please enter a valid age.";
            hasError = true;
        }
        if (!height || height <= 0) {
            errors.height.textContent = "Please enter a valid height (in inches).";
            hasError = true;
        }
        if (!weight || weight <= 0) {
            errors.weight.textContent = "Please enter a valid weight.";
            hasError = true;
        }
        if (!goalWeight || goalWeight <= 0) {
            errors.goal.textContent = "Please enter a valid goal weight.";
            hasError = true;
        }
        if (!gender) {
            errors.gender.textContent = "Please select your gender.";
            hasError = true;
        }

        if (!activityLevel) {
            errors.activity.textContent = "Please select your activity level.";
            hasError = true;
        }

        if (hasError) {
            recommendationsDashboard.innerHTML = `<p>Please fix the errors above to see recommendations.</p>`;
            return;
        }

        const userInputs = {
            goalWeight,
            weight,
            age,
            height,
            gender,
            activityLevel
        };
        localStorage.setItem("userInputs", JSON.stringify(userInputs));

        if (!goalWeight || !age || !height || !weight) {
            recommendationsDashboard.innerHTML = `<p>Fill in all fields to get recommendations.</p>`;
            return;
        }

        let BMR;
        if (gender === "male") {
            BMR = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
        } else {
            BMR = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
        }

        let activityMultiplier;
        if (activityLevel === "low") {
            activityMultiplier = 1.2;
        } else if (activityLevel === "medium") {
            activityMultiplier = 1.55;
        } else {
            activityMultiplier = 1.9;
        }

        let totalCalories = Math.round(BMR * activityMultiplier);

        let proteinGrams = Math.round(goalWeight * 1.2);
        let fatGrams = Math.round(totalCalories * 0.25 / 9);
        let carbGrams = Math.round((totalCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4);

        recommendationsDashboard.innerHTML = `
            <p>Based on your goal weight of ${goalWeight} lbs:</p>
            <p>Total Daily Calories: ${totalCalories}</p>
            <p>${proteinGrams} grams of protein per day</p>
            <p>${fatGrams} grams of fats per day</p>
            <p>${carbGrams} grams of carbs per day</p>
        `;
    });

    const resetBtn = document.getElementById("reset-btn");

    resetBtn.addEventListener("click", function () {
        form.reset();

        localStorage.removeItem("userInputs");

        Object.values(errors).forEach(el => el.textContent = "");

        recommendationsDashboard.innerHTML = `
            <p>Based on your goal weight of ${goalWeight} lbs:</p>
            <p>Total Daily Calories: ${totalCalories}</p>
            <p>${proteinGrams} grams of protein per day</p>
            <p>${fatGrams} grams of fats per day</p>
            <p>${carbGrams} grams of carbs per day</p>
        `;
    })
});




