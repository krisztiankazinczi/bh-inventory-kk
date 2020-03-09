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

  getAllWhs(req, res, error) {
    const sql = `SELECT id, name, address FROM warehouse`;

      return new Promise((resolve, reject) => {
        db.all(sql, (err, results) => {
          if (err) {console.error(err.toString()); reject(err)}
          else resolve(results)
        });
      })
        
  }

  addWh(req, res, name, address, error) {
    const stmt = db.prepare("INSERT INTO warehouse(name, address) VALUES (?,?)");
      return new Promise((resolve) => {  
        // ha mindket mezo ki volt toltve, akkor hozza letre a sort az adatbazisban, kulonben egy hibauzenetet kuld vissza
        if (name && address) {
            stmt.run(name, address);
            resolve('success')
        } else {
            error = 'Nem sikerult hozzaadni a raktarat, mert nem minden mezo volt kitoltve.'
            resolve(error);
        }
      });
  }

  editWh(req, res, id, name, address, error) {
    const stmt = db.prepare("UPDATE warehouse SET name = ?, address = ? WHERE id = ?", err => {if (err) console.error(err.toString())});

    db.serialize(function () {
        if (name && address) {
            stmt.run(name, address, id);
            res.redirect('/warehouses');
        } else {
            error = 'Nem sikerult hozzaadni a raktarat, mert nem minden mezo volt kitoltve.'
            res.redirect('/warehouses');
        }
    });
}

}

const warehouse = new Warehouse();

module.exports = warehouse;

