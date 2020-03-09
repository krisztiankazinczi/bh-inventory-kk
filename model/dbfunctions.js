const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory1.db');

// warehouse functions

function getWhs(req, res, error) {
    const sql = `SELECT id, name, address FROM warehouse`;

    db.serialize(function () {
      db.all(sql, (err, results) => {
          if (err) console.error(err.toString())
  
          res.render(`warehouse`, {
              pageTitle: 'Raktarak',
              warehouses: results,
              error: error
          });
          error = undefined; // minden rendereles utan torlom az error uzenet erteket
  
      });
    });
  }

function addWh(req, res, name, address, error) {
    const stmt = db.prepare("INSERT INTO warehouse(name, address) VALUES (?,?)");
    
    db.serialize(function () {
        
        if (name && address) {
            stmt.run(name, address);
    
            res.redirect('/warehouses');
        } else {
            error = 'Nem sikerult hozzaadni a raktarat, mert nem minden mezo volt kitoltve.'
            res.redirect('/warehouses');
        }
    });
}

function editWh(req, res, id, name, address, error) {
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

function delWh(req, res, id, error) {
    const isWhEmpty = `SELECT product_id, warehouse_id, stock FROM inventory WHERE warehouse_id = ?`;
    const delStmt = db.prepare(`DELETE FROM warehouse WHERE id = ?`);

    db.serialize(function () {
        if (id) {
            //Csak akkor torlom, ha a raktar ures
            db.all(isWhEmpty, [id], (err, results) => {
              if (err) console.error(err.toString())
              if (results.length == 0) {
                delStmt.run(id);
                res.redirect('/warehouses');
              } else {
                  error = `Ez a raktar nem ures, igy nem tudjuk torolni az adatbazisbol`;
                  res.redirect('/warehouses');
              }
            });
              
          }
    });
}



  module.exports = {
      getWhs : getWhs,
      addWh : addWh,
      editWh : editWh,
      delWh : delWh
  }