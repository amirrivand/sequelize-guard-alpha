const _ = require('lodash');

class GuardControl {
  // defaults
  _roles = null;
  _actions = [];
  _resources = [];

  constructor(guard) {
    this.guard = guard;
  }

  allow(role) {
    if(typeof role === "string") {
      this._roles = role;
    }
    return this;
  }

  to(actions) {
    if (typeof actions === 'string') {
      this._actions = _.uniq([...this._actions, actions]);
    }
    if (Array.isArray(actions)) {
      this._actions = _.uniq([...this._actions, ...actions]);
    }
    return this;
  }

  on(resources) {
    if (typeof resources === 'string') {
      this._resources = _.uniq([...this._resources, resources]);
    }
    if (Array.isArray(resources)) {
      this._resources = _.uniq([...this._resources, ...resources]);
    }
    return this;
  }

  async commit() {
    const guard = this.guard;
    const role = this._roles;
    const actions = this._actions;
    const resources = this._resources;
    return guard.addPermsToRole(role, actions, resources);
  }
}

module.exports = GuardControl;
