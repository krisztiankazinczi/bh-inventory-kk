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

  getAllWhs(req, res) {
    const sql = `SELECT id, name, address FROM warehouse`;

      return new Promise((resolve, reject) => {
        db.all(sql, (err, results) => {
          if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
          else resolve(results)
        });
      })
        
  }

  addWh(req, res, name, address) {
    const stmt = db.prepare("INSERT INTO warehouse(name, address) VALUES (?,?)");
      return new Promise((resolve, reject) => {  
        // ha mindket mezo ki volt toltve, akkor hozza letre a sort az adatbazisban, kulonben egy hibauzenetet kuld vissza
        if (name && address) {
            stmt.run(name, address, (err) => {
              if (err) {
                console.error(err.toString()); 
                reject('Adatbazis hiba');
              }
              resolve('success')
            });
        } else {
            reject('Az egyik input field ures maradt');
        }
      });
  }

  editWh(req, res, id, name, address) {
    const stmt = db.prepare("UPDATE warehouse SET name = ?, address = ? WHERE id = ?");

    return new Promise((resolve, reject) => {
        if (name && address) {
            stmt.run(name, address, id, (err) => {
               if (err) { 
                  console.error(err.toString()) 
                  reject('Adatbazis hiba')
                 } else resolve('success');
            });
        } else {
            reject('Nem sikerult szerkeszteni a raktar tulajdonsagait, mert nem minden mezo volt kitoltve.');
        }
    });
  }


  delWh(req, res, id) {
    const isWhEmpty = `SELECT product_id, warehouse_id, stock FROM inventory WHERE warehouse_id = ?`;
    const delStmt = db.prepare(`DELETE FROM warehouse WHERE id = ?`);

    return new Promise( async (resolve, reject) => {
        if (id) {
          let results;
          try {
            results = await checkStockInWh(isWhEmpty, id);
          } catch (err) {
            console.log(err)
          }
          if (results.length == 0) {
            delStmt.run(id, err => {
              if (err) { 
                console.error(err.toString()) 
                reject('Adatbazis hiba')
              } else resolve('success')
            });          
          } else {
              reject(`Ez a raktar nem ures, igy nem tudjuk torolni az adatbazisbol`)
            }
        }
    });
  }


}

function checkStockInWh(sqlstmt, params) {
  return new Promise((resolve, reject) => {
    db.all(sqlstmt, [params], (err, results) => {
      if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
      resolve(results)
  });
})
}


const warehouse = new Warehouse();

module.exports = warehouse;

