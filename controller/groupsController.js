const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory.db');

router.get('/', (req, res) => {
    db.serialize(function () {
        db.all("SELECT * FROM groups", function (err, results) {
            if (err != null) {
                console.error(err.toString())
            }

            res.render('groups', {
                pageTitle: 'Csoportok',
                groups: results
            });

        });
    });
});


router.post('/addGroup', (req, res) => {
    const { group_name } = req.body;

    db.serialize(function () {

        if (group_name) {
            db.run(`INSERT INTO groups(groupname) VALUES ("${group_name}")`, (err) => {
                if (err) {
                    console.error(err.toString())
                };
            })
        }
    })

    res.redirect('/groups');
});

router.post('/editGroup', (req, res) => {
    const { group_name, id } = req.body;

    db.serialize(function () {

        if (group_name && id) {

                db.run(`UPDATE groups SET groupname = "${group_name}" WHERE id = ${id}`, (err) => {
                    if (err) {
                        console.error(err.toString())
                    }
                });
        
        }
    })

    res.redirect('/groups');
})


module.exports = router;