import { Sequelize } from 'sequelize';
import Exercise from './models/Exercise.js';
import FoodEntry from './models/food.js';
import workoutTrackerDB from './models/workoutTrackerModel.js';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/database.sqlite',
});

await sequelize.authenticate();
console.log('Database connected.');

Exercise.initModel(sequelize);
FoodEntry.initModel(sequelize);
workoutTrackerDB.init(sequelize);

await sequelize.sync();

export default sequelize;
export {FoodEntry };