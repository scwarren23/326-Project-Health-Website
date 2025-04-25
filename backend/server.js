import express from "express";
import cors from "cors";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dataRoutes from "./routes/foodTrackerRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import exerciseRoutes from './routes/ExerciseSuggestionsRoutes.js';
import { dirname } from "path";
import mainPageRoutes from "./routes/mainPageRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/getApiKey', (req, res) => {
    const apiKey = process.env.API_KEY;
    res.json({ apiKey });
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../frontend")));
app.use("/api/nutrition", nutritionRoutes);
app.use(express.static(path.resolve(__dirname, "../frontend/mainPage")));
app.use("/eventhub", express.static(path.resolve(__dirname, "../frontend/eventhub")));
app.use("/service", express.static(path.resolve(__dirname, "../frontend/service")));
app.use("/UIDesign", express.static(path.join(__dirname, "../frontend/UIDesign")));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/exercises', exerciseRoutes);
app.use("/api/mainPage", mainPageRoutes);

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

app.use('/api/foods', dataRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
