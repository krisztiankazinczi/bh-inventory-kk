const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class Product_in_group {
  contructor(db) {
    this.db = db;
  }

  createTable() {
    const sql = "CREATE TABLE IF NOT EXISTS product_in_group (product_id INTEGER NOT NULL, group_id INTEGER NOT NULL)"
    return this.db.run(sql)
  }

  insert(product_id, group_id) {
    return this.db.run(
      `INSERT INTO product_in_group (product_id, group_id)
        VALUES (?, ?)`,
        [product_id, group_id])
  }

}

module.exports = Product_in_group;