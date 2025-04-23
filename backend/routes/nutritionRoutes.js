import express from "express";
import { getNutritionData, saveNutritionData } from "../controllers/nutritionController.js";

const router = express.Router();

router.get("/", getNutritionData);
router.post("/", saveNutritionData);

export default router;