const _ = require('lodash');
const NodeCache = require('node-cache');
const { mappedRolesToIds } = require('../helpers/mappers');

class GuardNodeCache extends NodeCache {
  getRoles() {
    return this.get('roles');
  }

  getPerms() {
    return this.get('perms');
  }

  setRoles(roles) {
    return this.set('roles', roles);
  }
  setPerms(perms) {
    return this.set('perms', perms);
  }
  async getRolesWithPerms(guard) {
    const cache = this;
    const cRoles = _.values(cache.getRoles());

    let r2Fetch = cRoles
      .filter((role) => !role.Permissions)
      .map((role) => role.id);

    return guard
      .models()
      .GuardRole.findAll({
        where: { id: r2Fetch },
        include: 'Permissions',
      })
      .then((roles) => {
        let mappedRoles = mappedRolesToIds(roles);

        let roles2Save = {
          ...cache.getRoles(),
          ...mappedRoles,
        };
        cache.setRoles(roles2Save);
        return roles2Save;
      });
  }
}

module.exports = GuardNodeCache;
