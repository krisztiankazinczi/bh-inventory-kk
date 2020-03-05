const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class Warehouse {
  contructor(db) {
    this.db = db;
  }

  createTable() {
    const sql = "CREATE TABLE IF NOT EXISTS warehouse (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(128) NOT NULL, address VARCHAR(128) NOT NULL)"
    return this.db.run(sql)
  }

  insert(name, address) {
    return this.db.run(
      `INSERT INTO warehouse (name, address)
        VALUES (?, ?)`,
        [name, address])
  }

}

module.exports = Warehouse;