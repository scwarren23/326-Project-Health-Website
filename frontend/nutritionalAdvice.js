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

        const goalWeight = goalWeightInput.value;
        const age = ageInput.value;
        const height = heightInput.value;
        const weight = curWeightInput.value;
        const gender = genderInput.value;
        const activityLevel = activityLevelInput.value;

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
});




