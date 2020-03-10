// const Promise = require('bluebird')
// const AppDB = require('./model/dbConnect');
// const Group = require('./model/groups');
// const Inventory = require('./model/inventory');
// const Product = require('./model/products');
// const Warehouse = require('./model/warehouse');
// const Product_in_group = require('./model/products_in_group');

// const g = [
//         { groupname: 'Szamitastechnika', parent_id: 0 },
//         { groupname: 'Konyhatechnika', parent_id: 0 },
//         { groupname: 'Szepsegapolas', parent_id: 0 },
//         { groupname: 'Szorakozas', parent_id: 0 },
//         { groupname: 'Futestechnika', parent_id: 0 },
//         { groupname: 'Elelmiszer', parent_id: 0 }
//       ];

// function createDbStructure() {
//   const db = new AppDB('./inventory2.db');
//   console.log(db)
//   const groups = new Group(db);
//   const inventory = new Inventory(db);
//   const product = new Product(db);
//   const warehouse = new Warehouse(db);
//   const product_in_group = new Product_in_group(db);

//   groups.createTable()
//   product.createTable()
//   warehouse.createTable()
//   inventory.createTable()
//   product_in_group.createTable()


  // Promise.all(g.map((group) => {
  //   const { groupname, parent_id } = group
  //   return groups.insert(groupname, parent_id)
  // }))


  // groups.createTable()
  //   .then( () => product.createTable() )
  //   .then( () => warehouse.createTable() )
  //   .then( () => inventory.createTable() )
  //   .then( () => product_in_group.createTable() )
  //   .then( data => {
  //     console.log(g)
  //     return Promise.all(g.map((group) => {
  //       const { groupname, parent_id } = group
  //       return groups.insert(groupname, parent_id)
  //     }))
  //   })
  //   .catch((err) => {
  //     console.log('Error: ')
  //     console.log(JSON.stringify(err))
  //   })
    
// }

// createDbStructure();




const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory1.db')

db.serialize(function () {

    db.run("CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, groupname VARCHAR(60) NOT NULL, parent_id INTEGER)");

    db.run("INSERT INTO groups(groupname, parent_id) VALUES ('Szamitastechnika', NULL)");
    db.run("INSERT INTO groups(groupname, parent_id) VALUES ('Konyhatechnika', 1)");
    db.run("INSERT INTO groups(groupname, parent_id) VALUES ('Szepsegapolas', 1)");
    db.run("INSERT INTO groups(groupname, parent_id) VALUES ('Szorakozas', NULL)");
    db.run("INSERT INTO groups(groupname, parent_id) VALUES ('Futestechnika', 4)");
    db.run("INSERT INTO groups(groupname, parent_id) VALUES ('Elelmiszer', 4)");

    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, description TEXT NOT NULL)");

    db.run("INSERT INTO products(name, description) VALUES ('Vezetek nélkuli eger', 'Olyan eger ami vezetek nelkul csatlakozik a szamitogephez')");
    db.run("INSERT INTO products(name, description) VALUES  ('Winchester', 'Szamitogepekben adattarolasra hasznalt egyseg')");
    db.run("INSERT INTO products(name, description) VALUES  ('Elektromos radiator', 'Modern futesi eszkoz')");
    db.run("INSERT INTO products(name, description) VALUES  ('Gaba monitor', 'A legjobb monitor tipus')");

    db.run("CREATE TABLE IF NOT EXISTS warehouse (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(128) NOT NULL, address VARCHAR(128) NOT NULL)");

    db.run("INSERT INTO warehouse(name, address) VALUES ('1-es raktar', 'Győr, Kossuth Lajos u. 7, 9025')");
    db.run("INSERT INTO warehouse(name, address) VALUES ('2-es raktar', 'Budapest, Gyáli út 50, 1097')");


    db.run("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, warehouse_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id), FOREIGN KEY (warehouse_id) REFERENCES warehouse (id))");

    db.run("INSERT INTO inventory(product_id, warehouse_id, stock) VALUES (1, 1, 18)");
    db.run("INSERT INTO inventory(product_id, warehouse_id, stock) VALUES (2, 1, 13)");
    db.run("INSERT INTO inventory(product_id, warehouse_id, stock) VALUES (3, 2, 4)");
    db.run("INSERT INTO inventory(product_id, warehouse_id, stock) VALUES (4, 2, 2)");


    db.run("CREATE TABLE IF NOT EXISTS product_in_group (product_id INTEGER NOT NULL, group_id INTEGER NOT NULL)");

    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (1, 1)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (1, 2)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (1, 3)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (1, 4)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (2, 1)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (3, 5)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (4, 1)");

});

