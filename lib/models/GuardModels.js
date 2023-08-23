'use strict';
const { models: getModels } = require('../migrations/guard-schema');
const modelOptions = require('./modelOptions');

module.exports = (guard, options) => {
  const sequelize = guard._sequelize;

  const models = getModels(options);

  const GuardModels = {};

  for (const tableName in models) {
    const model = models[tableName];
    GuardModels[model.name] = sequelize.define(model.name, model.schema, {
      ...modelOptions(options),
      tableName: options.prefix + tableName,
      ...(model.options ?? {})
    });
  }

  GuardModels.GuardRole.hasMany(GuardModels.GuardRole, { as: 'ChildRoles', foreignKey: 'parent_id' });
  GuardModels.GuardRole.belongsTo(GuardModels.GuardRole, { foreignKey: 'parent_id', as: 'Parent' });
  
  GuardModels.GuardRole.belongsToMany(GuardModels.GuardPermission, {
    through: 'RolePermission',
    as: 'Permissions',
    foreignKey: 'role_id',
    otherKey: "permission_id"
  });
  GuardModels.GuardPermission.belongsToMany(GuardModels.GuardRole, {
    through: 'RolePermission',
    as: 'Roles',
    foreignKey: 'permission_id',
    otherKey: "role_id"
  });

  GuardModels.GuardUser = options.UserModel;

  GuardModels.GuardRole.belongsToMany(GuardModels.GuardUser, {
    through: 'RoleUser',
    as: 'Users',
    foreignKey: "role_id",
    otherKey: `${options.UserModel.name.toLowerCase()}_${options.UserModel.primaryKeyAttribute}`
  });
  GuardModels.GuardUser.belongsToMany(GuardModels.GuardRole, {
    through: 'RoleUser',
    as: 'Roles',
    foreignKey: `${options.UserModel.name.toLowerCase()}_${options.UserModel.primaryKeyAttribute}`,
    otherKey: "role_id",
  });

  return GuardModels;
};
