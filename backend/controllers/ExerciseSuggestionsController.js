import {
    getAllExercises,
    getExerciseById,
    addExercise,
    updateExercise,
    deleteExercise
  } from '../models/ExerciseSuggestionsModel.js';
  
  export async function getExercises(req, res) {
    const exercises = await getAllExercises();
    res.json(exercises);
  }
  
  export async function getExerciseByIdHandler(req, res) {
    const exercise = await getExerciseById(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(exercise);
  }
  
  export async function createExercise(req, res) {
    try {
      const newExercise = await addExercise(req.body);
      res.status(201).json(newExercise);
    } catch (err) {
      console.error("Error adding exercise:", err);
      res.status(500).json({ error: "Failed to add exercise" });
    }
  }
  
  export async function updateExerciseHandler(req, res) {
    const updatedExercise = await updateExercise(req.params.id, req.body);
    if (!updatedExercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(updatedExercise);
  }
  
  export async function deleteExerciseHandler(req, res) {
    const deletedExercise = await deleteExercise(req.params.id);
    if (!deletedExercise) return res.status(404).json({ error: 'Exercise not found' });
    res.json(deletedExercise);
  }
  