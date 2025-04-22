const express = require("express");
const router = express.Router();
const {
    getNutritionData,
    saveNutritionData
} = require("../controllers/nutritionController");

router.get("/", getNutritionData);
router.post("/", saveNutritionData);

module.exports = router;