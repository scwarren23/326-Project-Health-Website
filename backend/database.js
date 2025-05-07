import { Sequelize } from 'sequelize';
import Exercise from './models/Exercise.js';
import SQLiteNutritionModel, { initNutritionModel } from './models/nutritionModel.js';
import FoodEntry from './models/food.js';
import SQLiteNutritionModel, { initProfileModel } from './models/nutritionModel.js';
import SQLiteProfileModel from './models/Profile.js';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/database.sqlite',
});

await sequelize.authenticate();
console.log('Database connected.');

Exercise.initModel(sequelize);
initNutritionModel(sequelize);

await SQLiteNutritionModel.init(false, sequelize);

FoodEntry.initModel(sequelize);

initProfileModel(sequelize);
await SQLiteProfileModel.init(false, sequelize);

await sequelize.sync();

export default sequelize;
export {FoodEntry };