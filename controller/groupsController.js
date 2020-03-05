const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory1.db');

router.get('/', (req, res) => {
    db.serialize(function () {
        db.all("SELECT id, groupname, parent_id FROM groups", function (err, results) {
            if (err) console.error(err.toString());
            res.render('groups', {
                pageTitle: 'Csoportok',
                groups: results
            });

        });
    });
});


router.post('/addGroup', (req, res) => {
    const { group_name, group_main_id } = req.body;
    // group_main_id erteke 0 ha uj fo kategoriat hozunk letre
    if (group_name) {
    db.serialize(function () {
            const stmt = db.prepare("INSERT INTO groups(groupname, parent_id) VALUES (?,?)");
            (group_main_id == "0") ? stmt.run(group_name, 0) : stmt.run(group_name, group_main_id);
        
        res.redirect('/groups');
    });
    }
});

router.post('/editGroup', (req, res) => {
    const { group_name, id, group_main_id } = req.body;
    console.log(id, group_main_id)
if (group_name && id) {
    db.serialize(function () {
        db.run(`UPDATE groups SET groupname = "${group_name}", parent_id = "${group_main_id}" WHERE id = ${id}`, (err) => {
            if (err) console.error(err.toString());
        });
        db.get(`SELECT id, parent_id FROM groups WHERE id=${id}`, (err, result) => {
          if (err) console.error(err.toString());
          
          if (result.parent_id == null) {
            db.run(`UPDATE groups SET parent_id = ${result.id} WHERE parent_id = ${group_main_id}`, (err) => {
               if (err) console.error(err.toString());
            })
          }
        });
    

        res.redirect('/groups');
    });  
} 
});

router.post('/delGroup', (req,res) => {
  //id a group_id
  let { id } = req.body;
  id = parseInt(id);

  db.serialize(function () {

        if (id) {
          //Csak akkor torlom, ha nincs alkategoriaja az adott kategorianak
          db.all(`SELECT id, groupname, parent_id FROM groups WHERE parent_id = ${id}`, (err, results) => {
            if (err) console.error(err.toString())
            if (results.length == 0) {
              db.run(`DELETE FROM groups WHERE id = ${id};`, (err) => {
                if (err) console.error(err.toString())
              });

              // torlom a kapcsolt tablabol az osszes erteket, ahol a group_id = id-val
                db.all(`DELETE FROM product_in_group WHERE group_id = ${id};`, (err) => {
                  if (err) console.error(err.toString())
                });
            }
          });
            res.redirect('/groups');
        }
    });
});


module.exports = router;


db.all("SELECT id, groupname, parent_id FROM groups", function (err, results) {
            if (err) console.error(err.toString());
            console.log(results)
})