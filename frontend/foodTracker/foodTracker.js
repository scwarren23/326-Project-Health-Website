const apiKey = "eIIlEGTFpWMuB9jb4vy2PgxfGf8nMfa5wqt9YeUA"; 
let currFood = "";
let db;


const request = indexedDB.open("foodTrackerDB", 1);
request.onerror = () => console.error("Database failed to open");
request.onsuccess = () => {
    db = request.result;
    loadSavedFoods();
};
request.onupgradeneeded = (e) => {
    let db = e.target.result;
    db.createObjectStore("foods", { keyPath: "id", autoIncrement: true });
};


let nutObj = { "serving": 1, "unit": "n", 1008: 0, 1003: 0, 1004: 0, 1005: 0, 2000: 0, 1079: 0, 1087: 0, 1089: 0, 1093: 0, 1104: 0, 1162: 0, 1253: 0 };
let trackersValues = { 1008: 0, 1003: 0, 1004: 0, 1005: 0, 2000: 0, 1079: 0, 1087: 0, 1089: 0, 1093: 0, 1104: 0, 1162: 0, 1253: 0 };
let defaultTrackerTotals = { 1008: 2500, 1003: 56, 1004: 80, 1005: 300, 2000: 36, 1079: 34, 1087: 1000, 1089: 8, 1093: 2300, 1104: 900, 1162: 90, 1253: 300 };
let x = structuredClone(nutObj);

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
    }
}

function displayResults(data) {
    const resultsDiv = document.getElementById("resultsDisplay");
    let prev = '';
    let j = 15;
    for (let i = 0; i < j; i++) {
        if (data.foods[i].description === prev) {
            j += 1;
            continue;
        } else {
            prev = data.foods[i].description;
        }
        const listItem = document.createElement('li');
        listItem.classList.add('result-item');
        listItem.textContent = data.foods[i].brandName
            ? `${data.foods[i].description}, ${data.foods[i].brandName}`
            : data.foods[i].description;

        listItem.addEventListener('click', () => {
            document.getElementById("resultsDisplay").innerHTML = "";
            resultsDiv.appendChild(listItem);
            currFood = listItem.textContent;
            document.getElementById("displayTitle").style.display = "none";
            document.getElementById("displayTitle2").style.display = "block";
            saveData(data.foods[i]);
        });

        resultsDiv.appendChild(listItem);
    }
}

function saveData(nutrientData) {
    let nutrients = nutrientData.foodNutrients;
    if (nutrientData.servingSize) {
        nutObj["serving"] = nutrientData.servingSize;
        nutObj["unit"] = nutrientData.servingSizeUnit;
    } else {
        nutObj["serving"] = 1;
    }
    nutrients.forEach(element => {
        if (Object.keys(nutObj).includes(String(element.nutrientId))) {
            nutObj[String(element.nutrientId)] = element.value;
        }
    });
}

function amountFood() {
    const foodQuery = String(document.getElementById("amountInput").value).toLowerCase();
    let amtEaten = foodQuery.includes("serving")
        ? parseFloat(foodQuery) * nutObj["serving"]
        : parseFloat(foodQuery);

    const foodNutObj = structuredClone(nutObj);
    for (let key in foodNutObj) {
        if (key !== "serving" && key !== "unit") {
            foodNutObj[key] *= amtEaten / foodNutObj["serving"];
        }
    }

    const foodlistItem = document.createElement('li');
    foodlistItem.classList.add('food-list-item');
    foodlistItem.textContent = foodNutObj["unit"] === "n"
        ? `${(amtEaten / foodNutObj["serving"]).toFixed(2)} servings: ${currFood}`
        : `${(amtEaten / foodNutObj["serving"]).toFixed(2)} servings / ${amtEaten}${foodNutObj["unit"]}: ${currFood}`;

    foodlistItem.foodNutObj = foodNutObj;

    foodlistItem.addEventListener('click', function () {
        for (let key in this.foodNutObj) {
            if (key !== "serving" && key !== "unit") {
                trackersValues[key] -= this.foodNutObj[key];
            }
        }

        const idToDelete = this.dataset.dbId;
        const tx = db.transaction(["foods"], "readwrite");
        const store = tx.objectStore("foods");
        store.delete(Number(idToDelete));

        this.remove();
        updateProgress();
    });

    document.getElementById("foodItems").appendChild(foodlistItem);
    document.getElementById("appearInfo").style.display = "none";
    document.getElementById("deleteInfo").style.display = "block";

    for (let key in foodNutObj) {
        if (key !== "serving" && key !== "unit") {
            trackersValues[key] += foodNutObj[key];
        }
    }

    const tx = db.transaction(["foods"], "readwrite");
    const store = tx.objectStore("foods");
    const item = {
        label: foodlistItem.textContent,
        nutData: foodNutObj
    };
    const request = store.add(item);
    request.onsuccess = () => foodlistItem.dataset.dbId = request.result;

    updateProgress();
}

function loadSavedFoods() {
    const tx = db.transaction("foods", "readonly");
    const store = tx.objectStore("foods");
    const request = store.openCursor();

    request.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
            const foodNutObj = cursor.value.nutData;
            const foodlistItem = document.createElement('li');
            foodlistItem.classList.add('food-list-item');
            foodlistItem.textContent = cursor.value.label;
            foodlistItem.dataset.dbId = cursor.key;
            foodlistItem.foodNutObj = foodNutObj;

            foodlistItem.addEventListener('click', function () {
                for (let key in this.foodNutObj) {
                    if (key !== "serving" && key !== "unit") {
                        trackersValues[key] -= this.foodNutObj[key];
                    }
                }
                const delTx = db.transaction(["foods"], "readwrite");
                const delStore = delTx.objectStore("foods");
                delStore.delete(Number(this.dataset.dbId));
                this.remove();
                updateProgress();
            });

            document.getElementById("foodItems").appendChild(foodlistItem);

            for (let key in foodNutObj) {
                if (key !== "serving" && key !== "unit") {
                    trackersValues[key] += foodNutObj[key];
                }
            }

            cursor.continue();
        }
        updateProgress();
    };
}

function updateProgress() {
    function setProgressBarColor(progressBar, val) {
        if (val < 50) progressBar.style.setProperty('--progress-color', 'blue');
        else if (val <= 100) progressBar.style.setProperty('--progress-color', 'green');
        else progressBar.style.setProperty('--progress-color', 'red');
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
