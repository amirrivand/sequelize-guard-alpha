const _ = require('lodash');
const defaultOpts = require('../defaultOptions');
const { models, timestamps } = require('./guard-schema');

module.exports = {
  defaultOpts,
  up: function (queryInterface, _Sequelize, opts = {}) {
    const options = _.extend({}, defaultOpts, opts);
    const prefix = options.prefix;

    const modelsWithoutUsers = Object.entries(models(options)).filter(([tableName]) => tableName !== "users");

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all(modelsWithoutUsers.map(([tableName, data]) => queryInterface.createTable(
        prefix + tableName,
        _.assign(
          {},
          data.schema,
          options.timestamps ? timestamps.basic : {},
          options.timestamps && options.paranoid ? timestamps.paranoid : {}
        ), { transaction }
      ))
      );
    })
  },

  down: function (queryInterface, _Sequelize, opts = {}) {
    const options = _.extend({}, defaultOpts, opts);
    const prefix = options.prefix;

    const modelsWithoutUsers = Object.entries(models(options)).filter(([tableName]) => tableName !== "users").reverse();

    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all(modelsWithoutUsers.map(([tableName]) => queryInterface.dropTable(prefix + tableName, { transaction })));
    })
  },
};
