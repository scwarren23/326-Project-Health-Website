import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_PATH = path.join(__dirname, "../data/profile.json")

function getProfile(req, res) {
    if (!fs.existsSync(DATA_PATH)) {
        return res.status(404).json({ message: "No profile found"});
    }
    const data = fs.readFileSync(DATA_PATH, "utf8");
    res.json(JSON.parse(data));
}

function saveProfile(req, res) {
    const profile = req.body;
    if (!profile.name || !profile.email) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(profile, null, 2), "utf8");
    res.json({ message: "Profile saved" });
}

function deleteProfile(req, res) {
    if (fs.existsSync(DATA_PATH)) {
        fs.unlinkSync(DATA_PATH);
    }
    res.json({ message: "Profile deleted" });
}

export { getProfile, saveProfile, deleteProfile };