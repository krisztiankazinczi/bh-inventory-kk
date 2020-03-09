const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('inventory1.db');

class Warehouse {

  createTable() {
    const sql = "CREATE TABLE IF NOT EXISTS warehouse (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(128) NOT NULL, address VARCHAR(128) NOT NULL)"
    return db.run(sql)
  }

  insert(name, address) {
    return db.run(
      `INSERT INTO warehouse (name, address)
        VALUES (?, ?)`,
        [name, address])
  }

  getAllWh(req, res, error) {
    const sql = `SELECT id, name, address FROM warehouse`;

      return new Promise(resolve => {
        db.all(sql, (err, results) => {
          if (err) console.error(err.toString())
  
          res.render(`warehouse`, {
              pageTitle: 'Raktarak',
              warehouses: results,
              error: error
          });
          resolve(results)
          error = undefined; // minden rendereles utan torlom az error uzenet erteket
  
      });
      })
        
  }

}

module.exports = Warehouse;

