const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class AppDB {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database');
      }
    });
  }
}

module.exports = AppDB;