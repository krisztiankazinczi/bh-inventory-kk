var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory1.db')


function product(req, res) {
    db.serialize(function() {

        // db.all("SELECT * FROM groups", function (err, groups) {
        //     if (err != null) {
        //         console.error(err.toString())
        //     }

            

        //         db.all("SELECT products.id, products.name, products.group_id, groups.groupname FROM products JOIN groups ON products.group_id = groups.id", (err, results) => {
        //         if (err != null) {
        //             // hibakezelés
        //         }
        //         console.log(results);
        //       res.render('products', {
        //           pageTitle: 'Termékek',
        //           products: results,
        //           group: groups
        //       })
                
        //     });



        // });
            // lekerem az osszes termeket
        db.all("SELECT products.id, products.name FROM products", (err, products) => {
            if (err) console.error(err.toString());
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
                // lekerem az osszes csoportot a drop-down megjelenitesehez
                db.all("SELECT * FROM groups", function (err, groups) {
                    if (err) console.error(err.toString())
                    res.render('products', {
                        pageTitle: 'Termékek',
                        products: products,
                        group: groups
                    })
                })


            })



            
        })



        // db.all("select products.id, products.name, groups.groupname from products INNER JOIN product_in_group ON product_in_group.product_id = products.id INNER JOIN groups ON product_in_group.group_id = groups.id;", function (err, results) {
        //     if (err != null) {
        //         console.error(err.toString())
        //     }

        //     console.log(results)

            

                // db.all("SELECT products.id, products.name, products.group_id, groups.groupname FROM products JOIN groups ON products.group_id = groups.id", (err, results) => {
                // if (err != null) {
                //     // hibakezelés
                // }
                // console.log(results);
              
              
            



        });


        
      
    
}



function addProduct(req, res) {
    const { newproduct, product_cat, product_description } = req.body;
    console.log(newproduct, product_cat, product_description)
    console.log(product_cat)
    if (newproduct && product_cat && product_description) {
        db.serialize(function () {

            db.run(`INSERT INTO products(name, description) VALUES ("${newproduct}", "${product_description}")`, (err) => {
                if (err) console.error(err.toString());
            });

            db.get(`SELECT id FROM products WHERE name = "${newproduct}"`, (err, result) => {
                        if (err) console.error(err.toString());
        
                        db.run(`INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`, (err) => {
                            if (err) console.error(err.toString());
                        });
                    });


                

                    db.get(`SELECT id FROM products WHERE name = "${newproduct}"`, (err, product_id) => {
                        if (err) console.error(err.toString());
                        
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
                    });

                    


            // db.get(`SELECT id FROM groups WHERE groupname = "${product_cat}"`, (err, id) => {
            //     if (err) {
            //         console.error(err.toString())
            //     }


            //     db.run(`INSERT INTO products(name, group_id, description) VALUES ("${newproduct}", "${id.id}", "${product_description}")`, (err) => {
            //         if (err) {
            //             console.error(err.toString())
            //         }
            //     });

            //     db.get(`SELECT id FROM products WHERE name = "${newproduct}" AND group_id = "${id.id}"`, (err, result) => {
            //         if (err != null) {
            //             console.error(err.toString())
            //         }
    
            //         db.run(`INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`, (err) => {
            //             if (err != null) {
            //                 console.error(err.toString())
            //             }
            //         })
            //         res.redirect('/product');
            //     })
            // })

            })

            

            
    }
}


function editProduct(req, res) {
    let { id, newproduct, product_cat, product_description } = req.body;
    id = parseInt(id);
    if (newproduct && product_cat && product_description) {
        db.serialize(function () {

            db.get(`SELECT id FROM groups WHERE groupname = "${product_cat}"`, (err, selectedId) => {
                if (err) {
                    console.error(err.toString())
                }
                console.log(selectedId);
                db.run(`UPDATE products SET name = "${newproduct}", group_id = "${selectedId.id}", description = "${product_description}" WHERE id = ${id}`, (err) => {
                    if (err) {
                        console.error(err.toString())
                    }
                });

                res.redirect('/product');
            })
        })
    }
}


function deleteProduct(req, res) {
    let { id } = req.body;
    id = parseInt(id);
    if (id) {
        db.serialize(function () {

            db.run(`DELETE FROM inventory WHERE product_id = ${id};`, (err) => {
                if (err != null) {
                    console.error(err.toString())
                }
            })

                db.run(`DELETE FROM products WHERE id = ${id};`, (err) => {
                    if (err != null) {
                        console.error(err.toString())
                    }
                })

                res.redirect('/product');
            })
        
    }
}




module.exports = {
    product: product,
    addProduct : addProduct,
    editProduct: editProduct,
    deleteProduct: deleteProduct
}