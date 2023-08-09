const Sequelize = require('sequelize');
const SequelizeGuard = require('..');
const tests = require('./tests');
const { describe } = require("mocha");

const schemas = require('../lib/migrations/guard-schema').schemas;

describe('Sequelize Guard - SQLite', function () {
  var dbConfig = {
    dialect: 'sqlite',
    logging: false,
    // storage: './seql-guard-test-db.sqlite3',
  };

  before(function (done) {
    let self = this;
    const seq = new Sequelize(dbConfig);

    self.seqMem1 = new Sequelize(dbConfig);
    self.seqMem2 = new Sequelize(dbConfig);
    self.seqMem3 = new Sequelize(dbConfig);

    seq
      .authenticate()
      .then(function () {
        return seq.drop().then(function () {
          self.guard = new SequelizeGuard(seq, {});
          done();
        });
      })
      .catch(done);
  });

  run();
});

function run() {
  Object.keys(tests).forEach(function (test) {
    tests[test]();
  });
}
