const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')

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

    db.run("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id))");

    db.run("INSERT INTO inventory(product_id, stock) VALUES (1, 18)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (2, 13)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (3, 4)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (4, 2)");


    db.run("CREATE TABLE IF NOT EXISTS product_in_group (product_id INTEGER NOT NULL, group_id INTEGER NOT NULL)");

    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (1, 1)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (1, 2)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (1, 3)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (1, 4)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (2, 1)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (3, 5)");
    db.run("INSERT INTO product_in_group(product_id, group_id) VALUES (4, 1)");

});

