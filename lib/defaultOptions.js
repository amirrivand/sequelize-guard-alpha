var defaultOpts = {
  tables: {
    meta: 'meta',
    parents: 'parents',
    permissions: 'permissions',
    resources: 'resources',
    roles: 'roles',
    users: 'users',
  },
  prefix: 'guard_',
  primaryKey: 'id',
  timestamps: false,
  paranoid: false,
  sync: true,
  debug: false,
  UserModel: undefined,
  safeGuardDeletes: true,
  userCache: true,
  userCacheTtl: 60,
};

module.exports = defaultOpts;
