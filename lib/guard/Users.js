const _ = require("lodash");
const Sequelize = require("sequelize");
const GuardCache = require("./GuardCache");
const Op = Sequelize.Op;

class GuardUsers extends GuardCache {
	/**
	 * Make User
	 *
	 * @example
	 * // make a user
	 * guard.makePermission('blog','view')
	 *
	 *
	 * @param {Array|string} user - The name(s) of role
	 */
	makeUser(user) {
		// if(!this._models.GuardUser){
		//     throw new Error("Use this function when UserModel is passed in options");
		// }

		return this._models.GuardUser.create({
			name: user.name,
			email: user.email,
		});
	}

	/**
  * Assign role to user

   * @param  {Object} user - the user you want to give role
   * @param  {string} role - the role to give to user
   */
	assignRole(user, role) {
		return this.makeRole(role).then(({ role, created }) => {
			return user.addRole(role.id).then((d) => {
				return user;
			});
		});
	}

	/**
  * Assign roles to user

   * @param  {Object} user - the user you want to give role
   * @param  {Array} roles - the roles to give to user
   */
	assignRoles(user, roles) {
		return this.makeRoles(roles, { all: true })
			.then((allRoles) => {
				return user.getRoles().then((assignedRoles) => {
					return _.differenceBy(allRoles, assignedRoles, (r) => r.name);
				});
			})
			.then((roles2insert) => {
				return user.addRoles(roles2insert.map((r) => r.id));
			});
	}

	/**
  * Remove roles from association with user user

   * @param  {Object} user - the user you want to give role
   * @param  {string} roles - the roles to give to user
   */
	rmAssignedRoles(user, roles) {
		if (typeof roles === "string") roles = [roles];

		return this._models.GuardRole.findAll({
			where: { name: { [Op.in]: roles } },
		}).then((roles) => {
			return user.removeRoles(roles);
		});
	}

	async getUserRoles(user) {
		const cacheKey = `user_${user[this._options.userPk]}`;

		const userCache = await this.getUserCache();
		if (this._options.userCache) {
			const cachedRoles = userCache.get(cacheKey);
			if (cachedRoles) return cachedRoles;
		}

		const fetchedRoles = await user.getRoles();
		const jsonRoles = fetchedRoles.map((role) => role.toJSON());
		if (this._options.userCache) {
			userCache.set(cacheKey, jsonRoles, this._options.userCacheTtl);
		}
		return jsonRoles;
	}
}

module.exports = GuardUsers;
