import { Sequelize } from 'sequelize';
import Exercise from './models/Exercise.js';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/database.sqlite',
});

await sequelize.authenticate();
console.log('Database connected.');

Exercise.initModel(sequelize);

await sequelize.sync();

export default sequelize;
