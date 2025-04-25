import express from "express";
import cors from "cors";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dataRoutes from "./routes/foodTrackerRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";

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
app.use(express.static(path.resolve(__dirname, "../frontend/nutritionalAdvice")));
app.use("/api/nutrition", nutritionRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});

app.use('/api/foods', dataRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
