import express from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve UIDesign.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/UIDesign/UIDesign.html'));
});

//app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost${PORT}`);
});
