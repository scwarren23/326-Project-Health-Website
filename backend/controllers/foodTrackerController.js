import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/foodTrackerData.json');

// Helper: read JSON file
const readData = async () => {
    try {
      const data = await readFile(dataPath, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      console.error('Error reading data.json:', err);
      return [];
    }
  };
  
  const writeData = async (data) => {
    try {
      await writeFile(dataPath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error writing data.json:', err);
    }
  };
// GET all data
export const getAllData = async (req, res) => {
  const data = await readData();
  res.json(data);
};

// GET by ID
export const getDataById = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const data = await readData();
      const userData = data.find(entry => entry.id == userId);
  
      if (!userData) {
        return res.status(200).json({ nextFoodId: 0, foods: [] });
      }
  
      res.status(200).json({
        nextFoodId: userData.nextFoodId || 0,
        foods: userData.foods || [],
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };

// POST new entry
export const addData = async (req, res) => {
    try {
      const data = await readData();
      const { userId, label, nutData } = req.body;
  
      let userEntry = data.find(d => d.id == userId);
  
      if (!userEntry) {
        // New user
        userEntry = {
          id: userId,
          nextFoodId: 1,
          foods: []
        };
        data.push(userEntry);
      }
  
      const newFood = {
        foodId: userEntry.nextFoodId++,
        label,
        nutData
      };
  
      userEntry.foods.push(newFood);
      await writeData(data);
  
      res.status(201).json({ message: "Food added", foodId: newFood.foodId });
    } catch (error) {
      console.error("Error in addData:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  



// DELETE entry by ID
export const deleteData = async (req, res) => {
    const { userId, foodId } = req.params;
    const data = await readData();
  
    const userEntry = data.find(entry => entry.id == userId);
    if (!userEntry) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const originalLength = userEntry.foods.length;
    userEntry.foods = userEntry.foods.filter(f => f.foodId != foodId);
  
    if (userEntry.foods.length === originalLength) {
      return res.status(404).json({ message: "Food not found" });
    }
  
    await writeData(data);
    res.json({ message: "Food deleted successfully" });
  };


  