const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory1.db')

const inventory = require('../model/products');


router.get('/', async (req, res) => {
  let { orderby, order, page } = req.query;
  if (!page) page = 1;
  const offset = +page * 30 - 30;
  let order_by;
  if (orderby === 'product_id') order_by = 'products.id';
  if (orderby === 'product_name') order_by = 'products.name';
  if (orderby === 'product_cat') order_by = 'groups.groupname';
  if (orderby === undefined) order_by = 'products.id';
  if (!order) order = 'asc';

  // let totalCount;
  // try {
  //    totalCount = await inventory.getTotalProductsNum();
  // } catch (err) {
  //   error = err;
  // }
  
  // const lastPage = Math.ceil(totalCount.total / 30);

    db.serialize(function() {
      
            db.all(`SELECT  products.id, products.name, group_concat(groups.groupname) as groupname FROM products INNER JOIN product_in_group ON product_in_group.product_id = products.id INNER JOIN groups ON product_in_group.group_id = groups.id GROUP BY products.id ORDER BY ${order_by} ${order} LIMIT 30 OFFSET ${offset}`, (err, products) => {
                if (err) console.error(err.toString());

                db.all("SELECT id, groupname, parent_id FROM groups ORDER BY parent_id, id ASC", function (err, groups) {
                    if (err) console.error(err.toString())

                    res.render('products', {
                        pageTitle: 'Termékek',
                        products: products,
                        lastPage: lastPage =3,
                        group: groups,
                        page: page,
                        minusPage: page - 1,
                        plusPage: +page + 1,
                        orderby: orderby,
                        order: order
                    });
                });

            });
    
         });
})



router.post('/product', (req, res) => {
    const { product_name, product_cat, product_description } = req.body;

    if (product_name && product_cat && product_description) {
        db.serialize(function () {

            db.run(`INSERT INTO products(name, description) VALUES ("${product_name}", "${product_description}")`, (err) => {
                if (err) console.error(err.toString());
            });

            // db.get(`SELECT id FROM products WHERE name = "${product_name}"`, (err, result) => {
            //             if (err) console.error(err.toString());
        
            //             db.run(`INSERT INTO inventory(product_id, warehouse_id, stock) VALUES (${result.id}, 1, 0)`, (err) => {
            //                 if (err) console.error(err.toString());
            //             });
            //         });


                

                    db.get(`SELECT id FROM products WHERE name = "${product_name}"`, (err, product_id) => {
                        if (err) console.error(err.toString());
                        // ha tobb termekkategoriat valasztott ki, akkor for ciklussal vegigmegyek
                      if (Array.isArray(product_cat)) {  
                        for (let i = 0; i < product_cat.length; i++) {

                        db.get(`SELECT id FROM groups WHERE groupname = "${product_cat[i]}"`, (err, group_id) => {
                            if (err) console.error(err.toString());

                            db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${product_id.id}, ${group_id.id})`, (err) => {
                                if (err) console.error(err.toString());
                            });
                            
                        });
                       
                      }
                       res.redirect(req.headers.referer);
                    } else { // ha csak egy termekkategoriat valasztott ki
                        db.get(`SELECT id FROM groups WHERE groupname = "${product_cat}"`, (err, group_id) => {
                            if (err) console.error(err.toString());

                            db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${product_id.id}, ${group_id.id})`, (err) => {
                                if (err) console.error(err.toString());
                            });
                          
                        });
                        res.redirect(req.headers.referer);
                      }
                    
                    });

              
            });
     
    }
})


router.post('/editProduct', (req, res) => {
    let { id, product_name, product_cat, product_description } = req.body;
    id = parseInt(id);
    console.log(id, product_name, product_cat, product_description);

    if (product_name && product_cat && product_description) {
      // updatelem a product tablet az uj product nevvel es descriptionnel
      db.run(`UPDATE products SET name = "${product_name}", description = "${product_description}" WHERE id = ${id}`, (err) => {
        if (err) console.error(err.toString())
      });
      // Kitorlom a kapcsolt tablabol az osszes sort, ahol a product_id megegyezik a modositott idval
      db.run(`DELETE FROM product_in_group WHERE product_id = ${id};`, (err) => {
        if (err) console.error(err.toString())
      });
      // hozzaadom az uj kapcsolt adatokat a kapcsolt tablahoz
      if (Array.isArray(product_cat)) {
      for (let i = 0; i < product_cat.length; i++) {
        // a groupnev alapjan kivalasztom a groupid-kat
        console.log(product_cat[i])
        db.get(`SELECT id FROM groups WHERE groupname = "${product_cat[i]}"`, (err, group_id) => {
          if (err) console.error(err.toString());
          console.log(id)
          db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${id}, ${group_id.id})`, (err) => {
            if (err) console.error(err.toString());
          });
        });
      }
        res.redirect(req.headers.referer);
      } else {
        db.get(`SELECT id FROM groups WHERE groupname = "${product_cat}"`, (err, group_id) => {
          if (err) console.error(err.toString());
          console.log(id)
          db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${id}, ${group_id.id})`, (err) => {
            if (err) console.error(err.toString());
          });
        });
        res.redirect(req.headers.referer);
      }
      }

    })

router.post('/deleteProduct', (req, res) => {
    let { id } = req.body;
    id = parseInt(id);
    console.log(id)
    if (id) {
        db.serialize(function () {
          //ellenorzom, hogy 0db van-e az adott termekbol keszleten
          db.get(`SELECT SUM(stock) AS stock FROM inventory WHERE product_id = ${id} GROUP BY product_id;`, (err, result) => {
            if (err) console.error(err.toString())
            console.log(result)
            //csak akkor lehet torolni a termeket, ha 0db van belole
            if (result.stock === 0 ) {
              
              db.run(`DELETE FROM inventory WHERE product_id = ${id};`, (err) => {
                if (err) console.error(err.toString())
              });

              db.run(`DELETE FROM product_in_group WHERE product_id = ${id};`, (err) => {
                  if (err) console.error(err.toString())
                });

                db.run(`DELETE FROM products WHERE id = ${id};`, (err) => {
                    if (err) console.error(err.toString())
                });

                res.redirect(req.headers.referer);

            } else {
              res.redirect(req.headers.referer);
            }
          });

            
        
    });
}
})


router.post('/filterCategory', (req, res) => {
  const { product_cat_filter } = req.body;
  db.serialize(function () {
    db.get(`SELECT id, parent_id FROM groups WHERE groupname = "${product_cat_filter}"`, (err, filteredCategory) => {
      if (err) console.error(err.toString());
      console.log(filteredCategory.parent_id)
      let sqlWhere = filteredCategory.id;
      if (filteredCategory.parent_id == 0) {
        
        db.all(`SELECT id FROM groups WHERE parent_id = ${filteredCategory.id}`, (err, allCategories) => {
        
          allCategories.forEach( (cat, idx, array) => {
            if (idx !== array.length - 1){ 
               if (sqlWhere) sqlWhere += `${cat.id} OR `;
               else sqlWhere = `${cat.id} OR `
            } else {
              if (sqlWhere) sqlWhere += `${cat.id}`;
               else sqlWhere = `${cat.id}`;
            }

            
            });
          });

          }
          console.log(sqlWhere)
              db.all(`select products.id, products.name, groups.groupname from products INNER JOIN product_in_group ON product_in_group.product_id = products.id INNER JOIN groups ON product_in_group.group_id = groups.id WHERE product_in_group.group_id = ${sqlWhere}`, (err, result) => {
        if (err) console.error(err.toString());
      
        db.all("SELECT * FROM groups", function (err, groups) {
          if (err) console.error(err.toString())
            res.render('products', {
              pageTitle: 'Termékek',
              products: result,
              group: groups
            });
        });
        });
        
      
      //  else {
      // db.all(`select products.id, products.name, groups.groupname from products INNER JOIN product_in_group ON product_in_group.product_id = products.id INNER JOIN groups ON product_in_group.group_id = groups.id WHERE product_in_group.group_id = ${filteredCategory.id}`, (err, result) => {
      //   if (err) console.error(err.toString());
      // console.log('emit vagyok?')
      //   db.all("SELECT * FROM groups", function (err, groups) {
      //     if (err) console.error(err.toString())
      //       res.render('products', {
      //         pageTitle: 'Termékek',
      //         products: result,
      //         group: groups
      //       });
      //   });

      //   });
      // }
    });
  });
})



module.exports = router;