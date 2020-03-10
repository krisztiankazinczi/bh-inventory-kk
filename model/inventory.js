const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory1.db');

class Inventory {

  createTable() {
    const sql = "CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, warehouse_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id), FOREIGN KEY (warehouse_id) REFERENCES warehouse (id))"
    return db.run(sql)
  }

  insert(product_id, warehouse_id, stock) {
    return db.run(
      `INSERT INTO inventory (product_id, warehouse_id, stock)
        VALUES (?, ?)`,
        [product_id, warehouse_id, stock])
  }

  getTotalProductsNum() {
    const getTotal = `SELECT COUNT(name) AS total FROM products`;
    
    return new Promise( async (resolve, reject) => {
      let totalProductsNum;
    try {
      totalProductsNum = await getSg(getTotal)
    } catch (err) {
      reject('Adatbazis hiba')
    }
    resolve(totalProductsNum)
    });
  }

  getProductsAndStock(offset, order_by, order ) {
    const getAllOrderBy = 'SELECT products.id, products.name, SUM(inventory.stock) AS stock FROM products LEFT JOIN inventory ON products.id = inventory.product_id GROUP BY products.id ORDER BY ?, ? LIMIT 30 OFFSET ?';

    const getAllWithoutOrderBy = 'SELECT products.id, products.name, SUM(inventory.stock) AS stock FROM products JOIN inventory ON products.id = inventory.product_id GROUP BY products.id LIMIT 30 OFFSET ?';
    return new Promise( async (resolve, reject) => {

      let results;
        try {
          
          if (order_by && order) {
             results = await getAllparam(getAllOrderBy, order_by, order, offset);
          } else {
            results = await getAll(getAllWithoutOrderBy, offset)
          } 
        } catch (err) {
          reject('Adatbazishiba')
        }
        console.log(results)
        resolve(results);
    });

  }

  editStock() {
    
  }


}

function getSg(sqlstmt, params) {
  return new Promise((resolve, reject) => {
    db.get(sqlstmt, [params], (err, results) => {
      if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
      resolve(results)
    });
  })
}

function getAll(sqlstmt, params) {
  return new Promise((resolve, reject) => {
    db.all(sqlstmt, [params], (err, results) => {
      console.log(sqlstmt, [params])
      if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
      resolve(results)
    });
  });
}

function getAllparam(sqlstmt, param1, param2, param3) {
  return new Promise((resolve, reject) => {
    db.all(sqlstmt, [param1, param2, param3], (err, results) => {
      if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
      console.log(sqlstmt, [param1, param2, param3])
      resolve(results)
    });
  });
}

const inventory = new Inventory();

module.exports = inventory;