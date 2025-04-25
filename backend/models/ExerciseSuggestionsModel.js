import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data', 'exercises.json');

async function readData() {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

async function writeData(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

export async function getAllExercises() {
  return await readData();
}

export async function getExerciseById(id) {
  const exercises = await readData();
  return exercises.find(ex => ex.id === id);
}

export async function addExercise(exercise) {
  const exercises = await readData();
  exercise.id = Date.now().toString(); // use string for IDs
  exercises.push(exercise);
  await writeData(exercises);
  return exercise;
}

export async function updateExercise(id, updatedExercise) {
  const exercises = await readData();
  const index = exercises.findIndex(ex => ex.id === id);
  if (index === -1) return null;
  exercises[index] = { ...exercises[index], ...updatedExercise };
  await writeData(exercises);
  return exercises[index];
}

export async function deleteExercise(id) {
  const exercises = await readData();
  const index = exercises.findIndex(ex => ex.id === id);
  if (index === -1) return null;
  const deleted = exercises.splice(index, 1)[0];
  await writeData(exercises);
  return deleted;
}
