const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class Product {
  contructor(db) {
    this.db = db;
  }

  createTable() {
    const sql = "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, description TEXT NOT NULL)"
    return this.db.run(sql)
  }


  insert(name, description) {
    return this.db.run(
      `INSERT INTO products (name, description)
        VALUES (?, ?)`,
        [name, description])
  }

}
module.exports = Product;