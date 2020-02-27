var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db')


function product(req, res) {
  let { orderby, order, page } = req.query;
    db.serialize(function() {
      if (!page) page = 1;
      const offset = +page * 30 - 30;
            // lekerem az osszes termeket
        db.all(`SELECT products.id, products.name FROM products LIMIT 30 OFFSET ${offset}`, (err, products) => {
            if (err) console.error(err.toString());
            // csinalok egy uj propertiet, amiben majd egy tombbent arolni fogom a kategoriakat
            for (let i = 0; i < products.length; i++) {
                products[i].groupname = [];
            }
            
            // ezzel hozzarendelem az osszes groupname-t az egyes termekekhez
            db.all(`select products.id, products.name, groups.groupname from products INNER JOIN product_in_group ON product_in_group.product_id = products.id INNER JOIN groups ON product_in_group.group_id = groups.id`, (err, product_groups) => {
                if (err) console.error(err.toString());
            
                for (let j = 0; j < products.length; j++) {
                    
                    for (let i = 0; i < product_groups.length; i++) {
                        if (products[j].id === product_groups[i].id) {
                            products[j].groupname.push(product_groups[i].groupname)
                        }
 
                    }
                    
                }
                //sorba rendezem adott termeknel a termekkategoriakat, hogy minden termeknel abc sorrendben jelenjenek meg a termekkategoriak
                for(let i = 0; i < products.length; i++) {
                    products[i].groupname = products[i].groupname.sort((a, b) => (a > b) ? 1 : -1)
                }
                // Rendezesi query parameterek alapjan sortolom a megfelelo oszlopokat
                if (orderby === "product_name" && order === "asc") {
                  products = products.sort((a, b) => (a.name > b.name) ? 1 : -1)
                }
                if (orderby === "product_name" && order === "desc") {
                  products = products.sort((a, b) => (a.name < b.name) ? 1 : -1)
                }
                if (orderby === "product_cat" && order === "asc") {
                  products = products.sort((a, b) => (a.groupname > b.groupname) ? 1 : -1)
                }
                if (orderby === "product_cat" && order === "desc") {
                  products = products.sort((a, b) => (a.groupname < b.groupname) ? 1 : -1)
                }


                // lekerem az osszes csoportot a drop-down megjelenitesehez
                db.all("SELECT * FROM groups", function (err, groups) {
                    if (err) console.error(err.toString())
                    res.render('products', {
                        pageTitle: 'Termékek',
                        products: products,
                        group: groups
                    });
                });

            });
 
        });

        });

}



function addProduct(req, res) {
    const { product_name, product_cat, product_description } = req.body;

    if (product_name && product_cat && product_description) {
        db.serialize(function () {

            db.run(`INSERT INTO products(name, description) VALUES ("${product_name}", "${product_description}")`, (err) => {
                if (err) console.error(err.toString());
            });

            db.get(`SELECT id FROM products WHERE name = "${product_name}"`, (err, result) => {
                        if (err) console.error(err.toString());
        
                        db.run(`INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`, (err) => {
                            if (err) console.error(err.toString());
                        });
                    });


                

                    db.get(`SELECT id FROM products WHERE name = "${product_name}"`, (err, product_id) => {
                        if (err) console.error(err.toString());
                        // ha tobb termekkategoriat valasztott ki, akkor for ciklussal vegigmegyek
                      if (Array.isArray(product_cat)) {  
                        for (let i = 0; i < product_cat.length; i++) {

                        db.get(`SELECT id FROM groups WHERE groupname = "${product_cat[i]}"`, (err, group_id) => {
                            if (err) console.error(err.toString());
                            console.log(group_id.id)
                            console.log(product_id.id)

                            db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${product_id.id}, ${group_id.id})`, (err) => {
                                if (err) console.error(err.toString());
                            });
                            
                        });
                       
                      }
                       res.redirect('/product');
                    } else { // ha csak egy termekkategoriat valasztott ki
                        db.get(`SELECT id FROM groups WHERE groupname = "${product_cat}"`, (err, group_id) => {
                            if (err) console.error(err.toString());

                            db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${product_id.id}, ${group_id.id})`, (err) => {
                                if (err) console.error(err.toString());
                            });
                          
                        });
                        res.redirect('/product');
                      }
                    
                    });

              
            });
     
    }
}


function editProduct(req, res) {
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
        res.redirect('/product');
      } else {
        db.get(`SELECT id FROM groups WHERE groupname = "${product_cat}"`, (err, group_id) => {
          if (err) console.error(err.toString());
          console.log(id)
          db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${id}, ${group_id.id})`, (err) => {
            if (err) console.error(err.toString());
          });
        });
        res.redirect('/product');
      }
      }

    }

function deleteProduct(req, res) {
    let { id } = req.body;
    id = parseInt(id);
    if (id) {
        db.serialize(function () {
          //ellenorzom, hogy 0db van-e az adott termekbol keszleten
          db.get(`SELECT stock FROM inventory WHERE product_id = ${id};`, (err, result) => {
            if (err) console.error(err.toString())

            //csak akkor lehet torolni a termeket, ha 0db van belole
            if (result.stock === 0) {
              db.run(`DELETE FROM inventory WHERE product_id = ${id};`, (err) => {
                if (err) console.error(err.toString())
              });

                db.run(`DELETE FROM products WHERE id = ${id};`, (err) => {
                    if (err) console.error(err.toString())
                });

                res.redirect('/product');

            } else {
              res.redirect('/product');
            }
          });

            
        
    });
}
}


function filterCategory(req, res) {
  const { product_cat_filter } = req.body;
  db.serialize(function () {
    db.get(`SELECT id FROM groups WHERE groupname = "${product_cat_filter}"`, (err, id) => {
      if (err) console.error(err.toString());
      db.all(`select products.id, products.name, groups.groupname from products INNER JOIN product_in_group ON product_in_group.product_id = products.id INNER JOIN groups ON product_in_group.group_id = groups.id WHERE product_in_group.group_id = ${id.id}`, (err, result) => {
        if (err) console.error(err.toString());
      
        db.all("SELECT * FROM groups", function (err, groups) {
          if (err) console.error(err.toString())
            res.render('products', {
              pageTitle: 'Termékek',
              products: result,
              group: groups
            });
        });

        })

    })
  });
}



module.exports = {
    product: product,
    addProduct : addProduct,
    editProduct: editProduct,
    deleteProduct: deleteProduct,
    filterCategory: filterCategory
}