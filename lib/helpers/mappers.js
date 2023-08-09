const _ = require('lodash');

const mappedPermsToIds = function (objects, id = 'id') {
  if (!objects) return {};
  let mappedObj = {};
  objects.forEach((obj) => {
    mappedObj[obj[id]] = obj.toJSON();
  });
  return mappedObj;
};
const mappedRolesToIds = function (objects, id = 'id') {
  if (!objects) return {};
  let mappedObj = {};
  objects.forEach((obj) => {
    if (obj.Permissions) {
      obj.Permissions = obj.Permissions.map((perm) =>
        // perm.toJSON ? perm.toJSON() : perm
        perm.toJSON()
      );
    } else {
      obj.Permissions = false;
    }
    obj.dataValues.Permissions = obj.Permissions;

    mappedObj[obj[id]] = obj.toJSON();
  });
  return mappedObj;
};

module.exports = { mappedPermsToIds, mappedRolesToIds };
