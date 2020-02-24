const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')

db.serialize(function () {

    db.run("CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, groupname VARCHAR(60) NOT NULL)");

    db.run("INSERT INTO groups(groupname) VALUES ('Szamitastechnika')");
    db.run("INSERT INTO groups(groupname) VALUES ('Konyhatechnika')");
    db.run("INSERT INTO groups(groupname) VALUES ('Szepsegapolas')");
    db.run("INSERT INTO groups(groupname) VALUES ('Szorakozas')");
    db.run("INSERT INTO groups(groupname) VALUES ('Futestechnika')");

    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, description TEXT NOT NULL, group_id INTEGER NOT NULL, FOREIGN KEY (group_id) REFERENCES groups (id))");

    db.run("INSERT INTO products(name, description, group_id) VALUES ('Vezetek nélkuli eger', 'Olyan eger ami vezetek nelkul csatlakozik a szamitogephez', 1)");
    db.run("INSERT INTO products(name, description, group_id) VALUES  ('Winchester', 'Szamitogepekben adattarolasra hasznalt egyseg', 1)");
    db.run("INSERT INTO products(name, description, group_id) VALUES  ('Elektromos radiator', 'Modern futesi eszkoz', 5)");
    db.run("INSERT INTO products(name, description, group_id) VALUES  ('Gaba monitor', 'A legjobb monitor tipus', 1)");

    db.run("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id))");

    db.run("INSERT INTO inventory(product_id, stock) VALUES (1, 18)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (2, 13)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (3, 4)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (4, 2)");

});

