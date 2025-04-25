class workoutTrackerController {
  constructor(workoutTrackerService) {
    this.workoutTrackerService = workoutTrackerService;
  }

  async getAllWorkouts(req, res) {
    try {
      const workouts = await this.workoutTrackerService.getAllWorkouts();
      res.status(200).json(workouts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getWorkoutById(req, res) {
    try {
      const workout = await this.workoutTrackerService.getWorkoutById(req.params.id);
      if (!workout) {
        return res.status(404).json({ message: 'Workout not found' });
      }
      res.status(200).json(workout);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}