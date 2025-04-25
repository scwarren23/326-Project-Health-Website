import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mainPageRoutes from "./routes/mainPageRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../frontend/mainPage")));
app.use("/eventhub", express.static(path.resolve(__dirname, "../frontend/eventhub")));
app.use("/service", express.static(path.resolve(__dirname, "../frontend/service")));
app.use("/UIDesign", express.static(path.join(__dirname, "../frontend/UIDesign")));

app.use("/api/mainPage", mainPageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost${PORT}`);
});