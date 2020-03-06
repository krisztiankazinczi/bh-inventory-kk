const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory1.db');

router.get('/', (req, res) => {
  let { orderby, order, page } = req.query;
  if (!page) page = 1;
  const offset = +page * 30 - 30;
    let order_by;
    db.serialize(function () {
        if (orderby === 'product_name') order_by = 'products.name';
        if (orderby === 'product_quantity') order_by = 'stock';
        if (orderby && order) {
        db.all(`SELECT products.id, products.name, SUM(inventory.stock) AS stock FROM products JOIN inventory ON products.id = inventory.product_id GROUP BY products.id ORDER BY ${order_by} ${order} LIMIT 30 OFFSET ${offset}`, function (err, results) {
            if (err) console.error(err.toString())
            console.log(orderby, order)
            res.render('storage', {
                pageTitle: 'Készletek',
                storage: results,
                page: page,
                orderby: orderby,
                order: order
            });

        });
        } else {

        db.all(`SELECT products.id, products.name, SUM(inventory.stock) AS stock FROM products JOIN inventory ON products.id = inventory.product_id GROUP BY products.id LIMIT 30 OFFSET ${offset}`, function (err, results) {
            if (err) console.error(err.toString())

            res.render('storage', {
                pageTitle: 'Készletek',
                storage: results,
                page: page
            });

        });

        }
        
    });
})

router.post('/editStock', (req, res) => {
    const { stock_quantity, stock_wh_id, product_id } = req.body;
  console.log(stock_quantity, stock_wh_id, product_id)
    db.serialize(function () {
      if (stock_wh_id && stock_quantity) {
        for(let i = 0; i < stock_quantity; i++) {

            db.run(`UPDATE inventory SET stock = ${+stock_quantity[i]}, WHERE product_id = ${+product_id} AND warehouse_id = ${+stock_wh_id}`, (err) => {
                if (err) console.error(err.toString());
            });
        }
        res.redirect('/storage');
      }
        

    });

    
});

router.get('/loadWhs/:id', (req, res) => {
  const id = req.params.id;

  db.all(`SELECT inventory.warehouse_id, inventory.stock, warehouse.name FROM inventory JOIN warehouse ON inventory.warehouse_id = warehouse.id WHERE product_id = ${id}`, (err, result) => {
    if (err) console.error(err.toString());

    res.send(result)

  })


})

module.exports = router;
