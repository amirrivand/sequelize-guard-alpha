const { DataTypes } = require("sequelize");
const defaultOptions = require("../defaultOptions");

/**
 * 
 * @param {typeof defaultOptions} options 
 * @returns 
 */
const models = (options) => ({
    resources: {
        name: "GuardResource",
        schema: {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }
    },
    actions: {
        name: "GuardAction",
        schema: {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }
    },

    permissions: {
        name: "GuardPermission",
        schema: {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            resource: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            action: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            allow: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 1
            }
        }
    },
    roles: {
        name: "GuardRole",
        schema: {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            parent_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            }
        }
    },
    role_permission: {
        name: "GuardRolePermission",
        schema: {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            role_id: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            permission_id: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
        }
    },
    role_permission: {
        name: "RolePermission",
        schema: {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            role_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: options.prefix + "roles",
                    key: 'id',
                },
            },
            permission_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: options.prefix + "permissions",
                    key: 'id',
                },
            },
        },
        options: {
            indexes: [
                {
                    unique: true,
                    fields: ['role_id', 'permission_id'],
                },
            ],
        }
    },
    role_user: {
        name: "RoleUser",
        schema: {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            "role_id": {
                type: DataTypes.INTEGER,
                references: {
                    model: options.prefix + "roles",
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            [`${options.UserModel.name.toLowerCase()}_${options.UserModel.primaryKeyAttribute}`]: {
                type: options.UserModel.rawAttributes[options.UserModel.primaryKeyAttribute].type,
                references: {
                    model: options.UserModel.tableName,
                    key: options.UserModel.primaryKeyAttribute,
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }
        },
        options: {
            indexes: [
                {
                    unique: true,
                    fields: ["role_id", `${options.UserModel.name.toLowerCase()}_${options.UserModel.primaryKeyAttribute}`],
                },
            ],
        }
    }

});

const timestamps = {
    basic: {
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
    },
    paranoid: {
        deleted_at: DataTypes.DATE
    }
}

module.exports = {
    timestamps, models
};
