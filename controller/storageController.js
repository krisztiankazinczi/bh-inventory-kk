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
        if (orderby === 'product_id') order_by = 'products.id';
        if (orderby === 'product_quantity') order_by = 'stock';

        db.get(`SELECT COUNT(name) AS allProduct FROM products`, (err, allProduct) => {
          if (err) console.error(err.toString())
          const lastPage = Math.ceil(allProduct.allProduct / 30);
          

          if (orderby && order) {

            db.all(`SELECT products.id, products.name, SUM(inventory.stock) AS stock FROM products LEFT JOIN inventory ON products.id = inventory.product_id GROUP BY products.id ORDER BY ${order_by} ${order} LIMIT 30 OFFSET ${offset}`, function (err, results) {
                if (err) console.error(err.toString())
                
                res.render(`storage`, {
                    pageTitle: 'Készletek',
                    storage: results,
                    lastPage: lastPage,
                    page: page,
                    minusPage: page - 1,
                    plusPage: +page + 1,
                    orderby: orderby,
                    order: order
                });
    
            });
            } else {
    
            db.all(`SELECT products.id, products.name, SUM(inventory.stock) AS stock FROM products JOIN inventory ON products.id = inventory.product_id GROUP BY products.id LIMIT 30 OFFSET ${offset}`, function (err, results) {
                if (err) console.error(err.toString())

                res.render(`storage`, {
                    pageTitle: 'Készletek',
                    storage: results,
                    lastPage: lastPage,
                    page: page,
                    minusPage: page - 1,
                    plusPage: +page + 1
                });
    
            });
    
            }
        })
        
    });
})

router.post('/editStock', (req, res) => {
    const { stock_quantity, stock_wh_id, product_id } = req.body;
    console.log(stock_quantity, stock_wh_id, product_id)
    db.serialize(function () {
      
      if (Array.isArray(stock_quantity)) {
        for(let i = 0; i < stock_quantity.length; i++) {

            db.get(`SELECT id FROM inventory WHERE product_id = ${product_id} AND warehouse_id = ${+stock_wh_id[i]}`, (err, isItExists) => {
              if (err) console.error(err.toString());
              console.log(!isItExists)
              if (isItExists) {
                console.log(stock_quantity[i], stock_wh_id[i])
                db.run(`UPDATE inventory SET stock = ${+stock_quantity[i]} WHERE product_id = ${+product_id} AND warehouse_id = ${+stock_wh_id[i]}`, (err) => {
                  if (err) console.error(err.toString());
                });
              } else if (!isItExists) {
                console.log(product_id, stock_wh_id[i], stock_quantity[i])
                db.run(`INSERT INTO inventory(product_id, warehouse_id, stock) VALUES (${+product_id}, ${+stock_wh_id[i]}, ${+stock_quantity[i]})`, (err) => {
                  if (err) console.error(err.toString());
                });
              }
            })
            
            
        }
        res.redirect(req.headers.referer);
      } 
        

    });

    
});

router.get('/loadWhs/:id', (req, res) => {
  const id = req.params.id;

  db.all(`SELECT inventory.warehouse_id, inventory.stock, warehouse.name FROM inventory JOIN warehouse ON inventory.warehouse_id = warehouse.id WHERE product_id = ${id} ORDER BY warehouse.id`, (err, result) => {
    if (err) console.error(err.toString());
    console.log(result)
    db.all(`SELECT id, name FROM warehouse ORDER BY id`, (err, whs) => {
      if (err) console.error(err.toString());
      whs.map(w => {w.stock = 0; w.warehouse_id = w.id})
      res.send( {result: result, whs: whs})
    })
    

  })


})


module.exports = router;
