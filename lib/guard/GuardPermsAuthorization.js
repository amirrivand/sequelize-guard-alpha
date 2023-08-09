const _ = require('lodash');
const GuardUsers = require('./Users');

class GuardPermsAuthorization extends GuardUsers {
  /**
  * @private
   * @name can
   * @description Return true if user don't have the permission

   * @param {string} user - action resource separated by space, eg. 'read blog'
   * @param {string} permission - action resource separated by space, eg. 'read blog'
   */
  async userCant(user, permission) {
    return this.userCan(user, permission).then((result) => !result);
  }

  /**
    @private

   * @name can
   *
   * @param {string} user - action resource separated by space, eg. 'read blog'
   * @param {string} permission - action resource separated by space, eg. 'read blog'
   */
  async userCan(user, permission) {
    let _guard = this;

    let roles = await _guard.getUserRoles(user);

    return firstTrue(
      roles.map((role) =>
        _guard
          .getCache()
          .then((cache) => cache.getRolesWithPerms(_guard))
          .then((roles) => roles[role.id].Permissions)
          .then((perms) => this.resolvePermission(perms, permission))
      )
    );
  }

  /**
  @private
  */

  resolvePermission(givenPermissions, wantedPermission) {
    const allSymbol = '*';
    if (wantedPermission === '*') wantedPermission = '* *';
    let wPerms = wantedPermission.split(' ');
    let wAction = wPerms[0];
    let wResource = wPerms[1];

    let gA = [];
    let gR = [];
    givenPermissions.forEach((p) => {
      gA.push(JSON.parse(p.action));
      gR.push(p.resource);
    });

    for (var i = 0; i <= gR.length; i++) {
      if (
        (gR[i] === allSymbol &&
          (gA[i].includes('*') || gA[i].includes(wAction))) ||
        (gR[i] === wResource &&
          (gA[i].includes('*') || gA[i].includes(wAction)))
      )
        return true;
    }

    return false;
  }
}

module.exports = GuardPermsAuthorization;

/**
  @private
  */

function firstTrue(promises) {
  const newPromises = promises.map((p) => {
    return new Promise((resolve, reject) =>
      p.then((v) => v && resolve(true), reject)
    );
  });
  newPromises.push(Promise.all(promises).then(() => false));
  return Promise.race(newPromises);
}
