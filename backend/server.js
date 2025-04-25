import express from "express";
import cors from "cors";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from "url";
import { dirname } from "path";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import exerciseRoutes from './routes/ExerciseSuggestionsRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../frontend/nutritionalAdvice"))); // optional: if you have static frontend
app.use("/api/nutrition", nutritionRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/exercises', exerciseRoutes);

app.post('/api/exercises', async (req, res) => {
  try {
    const exercise = req.body;
    const newExercise = await addExercise(exercise);
    res.status(201).json(newExercise); // return the added exercise
  } catch (err) {
    console.error('Error adding exercise:', err);
    res.status(500).json({ error: 'Failed to add exercise' });
  }
});

// Serve UIDesign.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

//app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
