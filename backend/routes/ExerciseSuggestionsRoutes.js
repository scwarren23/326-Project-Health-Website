import express from 'express';
import {
  getExercises,
  getExerciseByIdHandler,
  createExercise,
  updateExerciseHandler,
  deleteExerciseHandler
} from '../controllers/ExerciseSuggestionsController.js';

const router = express.Router();

router.get('/', getExercises);
router.get('/:id', getExerciseByIdHandler);
router.post('/', createExercise);
router.put('/:id', updateExerciseHandler);
router.delete('/:id', deleteExerciseHandler);

router.post('/', async (req, res) => {
    try {
      const exercise = req.body;
      const newExercise = await addExercise(exercise);
      res.status(201).json(newExercise);
    } catch (err) {
      console.error('Error adding exercise:', err);
      res.status(500).json({ error: 'Failed to add exercise' });
    }
  });
  

export default router;
