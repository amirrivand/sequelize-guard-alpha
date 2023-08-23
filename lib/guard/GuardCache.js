const NodeCache = require("node-cache");
const { mappedRolesToIds, mappedPermsToIds } = require("../helpers/mappers");
const GuardNodeCache = require("../utils/cache");
const GuardPermissions = require("./Permissions");
const { Sequelize } = require("sequelize");
const _ = require("lodash");

class GuardCache extends GuardPermissions {
	constructor(...props) {
		super(...props);

		// cache roles and permissions

		if (this._options.sync) {
			Promise.all(
				_.map(this._models, (model) => {
					return model.sync({
						logging: this._options.debug ? console.log : false,
					});
				})
			).then((syncs) => {
				this.getCache();
			});
		} else {
			this.getCache();
		}
	}

	bindGuardListeners() {
		const cache = this._cache;

		this.onRolesCreated(function (roles) {
			roles = roles.map((role) => {
				role.Permissions = false;
				role.dataValues.Permissions = false;
				return role;
			});

			const mappedRoles = mappedRolesToIds(roles);

			cache.setRoles({
				...cache.getRoles(),
				...mappedRoles,
			});
		});

		this.onRolesDeleted(function (roles) {
			const existRoles = cache.getRoles();
			roles.forEach((role) => delete existRoles[role.id]);
			cache.setRoles(existRoles);
		});

		this.onPermsCreated(function (perms) {
			const mappedPerms = mappedPermsToIds(perms);
			cache.setPerms({
				...cache.getPerms(),
				...mappedPerms,
			});
		});

		this.onPermsAddedToRole(function (role) {
			const roles = [role];
			const mappedRoles = mappedRolesToIds(roles);
			cache.setRoles({
				...cache.getRoles(),
				...mappedRoles,
			});
		});

		this.onPermsRemovedFromRole(function (role) {
			const roles = [role];
			const mappedRoles = mappedRolesToIds(roles);
			cache.setRoles({
				...cache.getRoles(),
				...mappedRoles,
			});
		});
	}

	// Guard Cache
	resetCache() {
		if (!this._cache) {
			this._cache = new GuardNodeCache();
		}
		this._cache.flushAll();
		return this._cache;
	}

	async getCache() {
		try {
			if (!this._cache) {
				// cache instance
				const cache = this.resetCache();

				// role instances
				const roles = await this._models.GuardRole.findAll({
					include: ["Permissions"],
				});
				const mappedRoles = mappedRolesToIds(roles);

				// permission instances
				const perms = await this._models.GuardPermission.findAll();
				const mappedPerms = mappedPermsToIds(perms);

				cache.setRoles(mappedRoles);
				cache.setPerms(mappedPerms);
				this.bindGuardListeners();
				console.log("alpha-guard cached!");
			}

			return this._cache;
		} catch (err) {
			if (err instanceof Sequelize.DatabaseError) {
				return guardMigrationErrShow();
			}
			return Promise.reject(err);
		}
	}

	// User Cache
	resetUserCache() {
		if (!this._usercache) {
			this._usercache = new NodeCache();
		}
		this._usercache.flushAll();
		return this._usercache;
	}
	async getUserCache() {
		if (this._usercache) {
			return this._usercache;
		} else {
			return this.resetUserCache();
		}
	}
}

function guardMigrationErrShow() {
	console.log("====================================");
	console.log(
		"\tTables for Guard not created, make sure you have run migrations or enabled sync option"
	);
	console.log("====================================");
}

module.exports = GuardCache;
