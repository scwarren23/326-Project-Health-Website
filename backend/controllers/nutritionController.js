import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NUTRITION_PATH = path.join(__dirname, "../data/nutrition.json");

function getNutritionData(req, res) {
    if (!fs.existsSync(NUTRITION_PATH)) {
        return res.status(404).json({message: "No nutrition data found"});
    }
    const data = fs.readFileSync(NUTRITION_PATH, "utf8");
    res.json(JSON.parse(data));
}

function saveNutritionData(req, res) {
    console.log("Received nutrition POST request:", req.body);

    const nutrition = req.body;
    const requiredFields = ["age", "weight", "height", "gender", "activityLevel", "goalWeight"];
    const missing = requiredFields.filter(field => !(field in nutrition));

    if (missing.length > 0) {
        console.log("Missing fields:", missing);
        return res.status(400).json({message: `Missing fields: ${missing.join(", ")}`});
    }

    fs.writeFileSync(NUTRITION_PATH, JSON.stringify(nutrition, null, 2), "utf8");
    console.log("Nutrition data saved.");
    res.json({message: "Nutrition data saved"});
}

function deleteNutritionData(req, res) {
    if (fs.existsSync(NUTRITION_PATH)) {
        fs.unlinkSync(NUTRITION_PATH);
        res.json({ message: "Nutrition data deleted" });
    } else {
        res.status(404).json({ message: "No nutrition data to delete" });
    }
}

export { getNutritionData, saveNutritionData, deleteNutritionData };