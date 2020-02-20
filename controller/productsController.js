const products = require('../model/products');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db')


function product(req, res) {
    db.serialize(function() {
        db.all("SELECT rowid, * FROM products", function(err, results) {
            if (err != null) {
                // hibakezelés
            }
            console.log(results);
          res.render('products', {
              pageTitle: 'Termékek',
              products: results
          })
            
        });
      });
    
}

module.exports = product;