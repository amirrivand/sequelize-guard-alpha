const GuardControl = require("./guard/GuardControl");
const GuardRolesAuthorization = require("./guard/GuardRolesAuthorization");
const migration = require("./migrations/guard-migrations");
const seeder = require("./seeder");

class SequelizeGuard extends GuardRolesAuthorization {
  // Guard Control
  init() {
    return new GuardControl(this);
  }

  allow(roles, actions, resources) {
    return this.init().allow(roles).to(actions).on(resources).commit();
  }
}

// db migrations
SequelizeGuard.migration = migration;

// db seeders
SequelizeGuard.seeder = seeder;

module.exports = SequelizeGuard
