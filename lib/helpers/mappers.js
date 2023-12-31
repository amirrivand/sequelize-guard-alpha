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
  objects?.forEach((obj) => {
    const role = obj.toJSON();
    if (obj.Permissions) {
      role.Permissions = obj?.Permissions?.map((perm) =>
        perm.toJSON ? perm.toJSON() : perm
      );
      // obj.Permissions = obj?.Permissions?.map((perm) =>
      //   // perm.toJSON ? perm.toJSON() : perm
      //   // perm.toJSON()
      //   perm
      // );
    } else {
      // obj.Permissions = false;
      role.Permissions = false;
    }
    // obj.dataValues.Permissions = obj.Permissions;

    mappedObj[obj[id]] = obj.toJSON ? obj.toJSON() : obj;
  });
  return mappedObj;
};

module.exports = { mappedPermsToIds, mappedRolesToIds };
