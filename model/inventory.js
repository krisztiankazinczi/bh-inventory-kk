const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class Inventory {
  contructor(db) {
    this.db = db;
  }

  createTable() {
    const sql = "CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, warehouse_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id), FOREIGN KEY (warehouse_id) REFERENCES warehouse (id))"
    return this.db.run(sql)
  }

  insert(product_id, warehouse_id, stock) {
    return this.db.run(
      `INSERT INTO inventory (product_id, warehouse_id, stock)
        VALUES (?, ?)`,
        [product_id, warehouse_id, stock])
  }

}

module.exports = Inventory;