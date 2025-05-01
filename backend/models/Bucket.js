const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Bucket = sequelize.define('Bucket', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = Bucket;
