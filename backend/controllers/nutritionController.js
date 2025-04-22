const fs = require("fs");
const path = require("path");

const NUTRITION_PATH = path.join(__dirname, "../data/nutrition.json");

function getNutritionData(req, res) {
    if (!fs.existsSync(NUTRITION_PATH)) {
        return res.status(404).json({message: "No nutrition data found"});
    }
    const data = fs.readFileSync(NUTRITION_PATH, "utf8");
    res.json(JSON.parse(data));
}

function saveNutritionData(req, res) {
    const nutrition = req.body;
    const requiredFields = ["age", "weight", "height", "gender", "activityLevel", "goalWeight"];
    const missing = requiredFields.filter(field => !(field in nutrition));

    if (missing.length > 0) {
        return res.status(400).json({message: `Missing fields: ${missing.join(", ")}`});
    }

    fs.writeFileSync(NUTRITION_PATH, JSON.stringify(nutrition, null, 2), "utf8");
    res.json({message: "Nutrition data saved"});
}

module.exports = { getNutritionData, saveNutritionData };