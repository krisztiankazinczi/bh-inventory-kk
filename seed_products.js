const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory1.db');

const adjectives = [
  "adó-vevő", "ajánlatos", "akadozó", "akadályozatlan", "akadékos", "akaratos", "adományozó", "agyonizzadt", "agrárius", "additív", "alakhű"
];

const pronouns = [
  "ablaktisztító", "abiogenezis", "abroncsvas", "acélhuzal", "acélideg", "adagolás", "abszurdum", "abszolúció", "abszint", "ablakfülke", "acetilén"
];

const category = [
  'Szamitastechnika', 'Konyhatechnika', 'Szepsegapolas', 'Szorakozas', 'Futestechnika'
];


for(let i = 0; i < adjectives.length; i++) {
  for(let j = 0; j < pronouns.length; j++) {
    db.serialize(function () {
      db.run(`INSERT INTO products(name, description) VALUES ("${adjectives[i]} ${pronouns[j]}", "${adjectives[i]} ${pronouns[j]}")`);

      db.get(`SELECT id FROM products WHERE name = '${adjectives[i]} ${pronouns[j]}'`, (err, id) => {
              if (err) console.error(err.toString());
              
              db.run(`INSERT INTO inventory(product_id, warehouse_id, stock) VALUES (${+id.id}, 2, 5)`);
              db.run(`INSERT INTO inventory(product_id, warehouse_id, stock) VALUES (${+id.id}, 1, 7)`);
              db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${+id.id}, 6)`);
            
    
    
    if (j % 2 === 0) {
        db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${+id.id}, 1)`);
      }
      
    if (j % 3 === 0) {
        db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${+id.id}, 2)`);
    }
    
    if (j % 4 === 0) {
        db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${+id.id}, 3)`);
    }
    if ( j % 5 === 0) {
        db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${+id.id}, 4)`);
    }
    if ( j % 6 === 0) {
        db.run(`INSERT INTO product_in_group(product_id, group_id) VALUES (${+id.id}, 5)`);
    }
    });
  });
  }
}

