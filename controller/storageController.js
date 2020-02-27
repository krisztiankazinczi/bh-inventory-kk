const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory.db');

router.get('/', (req, res) => {
  let { orderby, order, page } = req.query;

  if (!page) page = 1;
  const offset = +page * 30 - 30;

    db.serialize(function () {
        db.all(`SELECT products.id, products.name, inventory.stock FROM products JOIN inventory ON products.id = inventory.product_id LIMIT 30 OFFSET ${offset}`, function (err, results) {
            if (err) console.error(err.toString())

            if (orderby === "product_name" && order === "asc") results = results.sort((a, b) => (a.name > b.name) ? 1 : -1);
            if (orderby === "product_name" && order === "desc") results = results.sort((a, b) => (a.name < b.name) ? 1 : -1);
            if (orderby === "product_quantity" && order === "asc") results = results.sort((a, b) => (a.stock > b.stock) ? 1 : -1);
            if (orderby === "product_quantity" && order === "desc") results = results.sort((a, b) => (a.stock < b.stock) ? 1 : -1);


            res.render('storage', {
                pageTitle: 'Készletek',
                storage: results
            });

        });
    });
})

router.post('/editStock', (req, res) => {
    const { stock_quantity, stock_item_id } = req.body;
    console.log(stock_quantity, stock_item_id)
    db.serialize(function () {

        if (stock_item_id && stock_quantity) {
            db.run(`UPDATE inventory SET stock = ${+stock_quantity} WHERE product_id = ${+stock_item_id}`, (err) => {
                if (err) console.error(err.toString());
            });
        }
        res.redirect('/storage');
    });

    
});

module.exports = router;
