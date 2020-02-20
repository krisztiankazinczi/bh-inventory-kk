var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('inventory.db')

db.serialize(function () {
    db.run("CREATE TABLE IF NOT EXISTS products (name VARCHAR(100), category VARCHAR(60))")

    db.prepare('INSERT INTO products VALUES (?, ?)')
        .run('Processzor', 'Számítástechnika')
        .run('Sütő', 'Konyhatechnika')
        .run('Hajszárító', 'Szépségápolás')
        .run('RAM', 'Számítástechnika')

    db.all(`SELECT * FROM products;`, (err, rows) => {
        if (err) { console.log(err) }
        rows.forEach(row => console.log(row));
    });


});
