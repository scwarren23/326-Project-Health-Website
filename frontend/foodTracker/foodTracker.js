const apiKey = "";
let currFood =""; 

let nutObj = {
    "serving":1,
    "unit":"n",
    1008: 0,  // Calories
    1003: 0,  // Protein
    1004: 0,  // Fat
    1005: 0,  // Carbohydrates
    2000: 0,  // Sugar
    1079: 0,  // Fiber
    1087: 0,  // Calcium
    1089: 0,  // Iron
    1093: 0,  // Sodium
    1104: 0,  // Vitamin A
    1162: 0,  // Vitamin C
    1253: 0   // Cholesterol
  };
  let trackersValues = {
    1008: 0,  // Calories
    1003: 0,  // Protein
    1004: 0,  // Fat
    1005: 0,  // Carbohydrates
    2000: 0,  // Sugar
    1079: 0,  // Fiber
    1087: 0,  // Calcium
    1089: 0,  // Iron
    1093: 0,  // Sodium
    1104: 0,  // Vitamin A
    1162: 0,  // Vitamin C
    1253: 0   // Cholesterol
  };
  let defaultTrackerTotals = {
    1008: 2500,   // Calories
    1003: 56,     // Protein (g)
    1004: 80,     // Fat (g)
    1005: 300,    // Carbohydrates (g)
    2000: 36,     // Sugar (g)
    1079: 34,     // Fiber (g)
    1087: 1000,   // Calcium (mg)
    1089: 8,      // Iron (mg)
    1093: 2300,   // Sodium (mg)
    1104: 900,    // Vitamin A (µg RAE)
    1162: 90,     // Vitamin C (mg)
    1253: 300     // Cholesterol (mg)
};
let x = structuredClone(nutObj);
//console.log(x);

async function searchFood() {
    nutObj = structuredClone(x);
    const foodQuery = document.getElementById("foodInput").value;
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodQuery}&api_key=${apiKey}`;
    const displayTitle = document.getElementById("displayTitle");
    const displayTitle2 = document.getElementById("displayTitle2");
    
    document.getElementById("resultsDisplay").innerHTML = "";
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayTitle.style.display = "block";
        displayTitle2.style.display = "none";
        displayResults(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("results").textContent = "Error fetching data. Make sure you added the API key on slide 2 of the slide deck, to foodTracker.js";
    }
}

function displayResults(data) {
    
    const resultsDiv = document.getElementById("resultsDisplay");
    // const dataResults = data.foods.forEach(element => {
    //     return element.description+element.brandName
    // });
    
    let prev = '';
    let j=15
    for (let i=0;i<j;i++){
        if (data.foods[i].description === prev){
            j+=1
            continue
        }else{
            prev = data.foods[i].description;
        }
        //resultsDiv.textContent = JSON.stringify(data.foods, null, 2); // Pretty print JSON response
        const listItem = document.createElement('li');
        listItem.classList.add('result-item');

        if (data.foods.brandName){
            //resultsDiv.textContent = resultsDiv.textContent+`${data.foods[i].description},${data.foods[i].brandName}\n`
            
            listItem.textContent = `${data.foods[i].description},${data.foods[i].brandName}`;
        }else{
             //resultsDiv.textContent = resultsDiv.textContent+`${data.foods[i].description}\n`
             listItem.textContent = `${data.foods[i].description}`;
        }
        listItem.addEventListener('click',()=>{
            document.getElementById("resultsDisplay").innerHTML = "";
            resultsDiv.appendChild(listItem);
            currFood = listItem.textContent;
            displayTitle.style.display = "none";
            displayTitle2.style.display = "block";
            saveData(data.foods[i]);
        });

        resultsDiv.appendChild(listItem);
    }
    
}

function saveData(nutrientData){
    let nutrients = nutrientData.foodNutrients
    if (nutrientData.servingSize){
        nutObj["serving"] = nutrientData.servingSize;
        // console.log(nutrientData.servingSizeUnit)
        nutObj["unit"] = nutrientData.servingSizeUnit;
        // console.log(nutrientData.servingSizeUnit)
        
    }else{
        nutObj["serving"] = 1;
        
    }
    //console.log(nutrientData.servingSize);
    nutrients.forEach(element => {
        if (Object.keys(nutObj).includes(String(element.nutrientId))){
            nutObj[String(element.nutrientId)] = element.value;
        }
    });
}
//Ids Protein 1003, Fat 1004, carb 1005, calories 1008,sugar 2000, fiber 1079, 1087 calcium,iron 1089
//sodium 1093, 1104 vitA. 1162 vitC, cholesterol 1253,



function amountFood() {
    // console.log(nutObj['unit'])
    const foodQuery = String(document.getElementById("amountInput").value).toLowerCase();
    let amtEaten = 0;
    // console.log(foodQuery);
    // console.log(foodQuery.includes("serving"));
    // console.log(nutObj["serving"]);
    // nutObj["1003"] = 10;
    if (foodQuery.includes("serving")) {
        amtEaten = parseFloat(foodQuery) * nutObj["serving"];
    } else {
        amtEaten = parseFloat(foodQuery);
    }

    
    const foodNutObj = structuredClone(nutObj);

    
    for (let key in foodNutObj) {
        if (key !== "serving" && key !== "unit") {
            foodNutObj[key] = foodNutObj[key] * (amtEaten / foodNutObj["serving"]);
        }
    }

    
    const foodItemsDiv = document.getElementById("foodItems");
    const foodlistItem = document.createElement('li');
    foodlistItem.classList.add('food-list-item');

    if (foodNutObj["unit"] === "n") {
        foodlistItem.textContent = `${(amtEaten / foodNutObj["serving"]).toFixed(2)} servings: ${currFood}`;
    } else {
        foodlistItem.textContent = `${(amtEaten / foodNutObj["serving"]).toFixed(2)} servings / ${amtEaten}${foodNutObj["unit"]}: ${currFood}`;
    }

    
    foodlistItem.foodNutObj = foodNutObj;

    
    foodlistItem.addEventListener('click', function () {
        for (let key in foodlistItem.foodNutObj) {
            if (key !== "serving" && key !== "unit") {
                trackersValues[key] -= foodlistItem.foodNutObj[key];
            }
        }

        foodlistItem.remove();
        updateProgress();
    });

   
    foodItemsDiv.appendChild(foodlistItem);
    document.getElementById("appearInfo").style.display = "none";
    document.getElementById("deleteInfo").style.display = "block";

    
    for (let key in foodNutObj) {
        if (key !== "serving" && key !== "unit") {
            trackersValues[key] += foodNutObj[key];
        }
    }

    updateProgress();
}


function updateProgress() {
    function setProgressBarColor(progressBar, val) {
        if (val < 50) {
            progressBar.style.setProperty('--progress-color', 'blue');
        } else if (val >= 50 && val <= 100) {
            progressBar.style.setProperty('--progress-color', 'green');
        } else {
            progressBar.style.setProperty('--progress-color', 'red');
        }
    }

    const updateBar = (id, key) => {
        const progress = document.getElementById(id);
        const val = (trackersValues[key] / defaultTrackerTotals[key]) * 100;
        progress.value = val;
        document.getElementById(`${id}-value`).textContent = Math.round(val) + " %";
        setProgressBarColor(progress, val);
    };

    updateBar("calories", "1008");
    updateBar("protein", "1003");
    updateBar("total-fat", "1004");
    updateBar("carbohydrates", "1005");
    updateBar("sugar", "2000");
    updateBar("fiber", "1079");
    updateBar("calcium", "1087");
    updateBar("iron", "1089");
    updateBar("sodium", "1093");
    updateBar("vitA", "1104");
    updateBar("vitC", "1162");
    updateBar("cholesterol", "1253");
}
