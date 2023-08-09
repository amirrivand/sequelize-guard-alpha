const _ = require("lodash");
const EventEmitter = require("events");
const Sequelize = require("sequelize");
const defaultOpts = require("../defaultOptions");
const guardModels = require("../models/GuardModels");

const extendUserModel = require("../utils/extendUserModel");

class GuardCore {
	// Event Emitter
	_ee = new EventEmitter();

	// lib options
	_options = defaultOpts;

	/**
	 *
	 * @param {Sequelize} seqInstance
	 * @param {*} customOptions
	 */
	constructor(seqInstance, customOptions = {}) {
		// sequelize instance
		this._sequelize = seqInstance;

		// library options
		const options = _.extend({}, defaultOpts, customOptions);
		this._options = options;

		// library models
		this._models = guardModels(this, this._options);
		seqInstance.models.aclModels = this._models;

		// extending user model
		extendUserModel(this);
	}

	// get lib models
	models() {
		return this._models;
	}

	// event emitter config
	on(name, fn) {
		this._ee.on(name, fn);
		return () => this._ee.off(name, fn);
	}

	once(name, fn) {
		this._ee.once(name, fn);
		return () => this._ee.off(name, fn);
	}
}

module.exports = GuardCore;
