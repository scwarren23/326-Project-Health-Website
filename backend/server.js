import express from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dataRoutes from "./routes/foodTrackerRoutes.js";
import dotenv from 'dotenv';

dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();
const PORT = 3000;
app.get('/api/getApiKey', (req, res) => {
    const apiKey = process.env.API_KEY;
    res.json({ apiKey });
  });
app.use(express.json());


app.use(express.static(path.join(__dirname, '../frontend')));

//the root file in the main index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index/index.html'));
});
app.use('/api/foods', dataRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost${PORT}`);
});
