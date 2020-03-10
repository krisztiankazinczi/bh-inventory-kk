const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory1.db');

const group = require('../model/groups');

let error;

router.get('/', async (req, res) => {
  let results;
  try {
    results = await group.getGroups();
  } catch (err) {
    error = err;
  }
  res.render('groups', {
    pageTitle: 'Csoportok',
    groups: results,
    error: error
  });
});


router.post('/addGroup', async (req, res) => {
    const { group_name, group_main_id } = req.body;
    try {
      await group.addGroup(group_name, group_main_id);
    } catch (err) {
      error = err;
    }
    res.redirect('/groups');
});

router.post('/editGroup', async (req, res) => {
    const { group_name, id, group_main_id } = req.body;

    try {
      await group.editGroup(id, group_name, group_main_id);
    } catch (err) {
      error = err;
    }
    res.redirect('/groups');
});

router.post('/delGroup', async (req,res) => {
  //id a group_id
  let { id } = req.body;
  id = parseInt(id);

  try {
    await group.delGroup(id);
  } catch (err) {
    error = err;
  }
  res.redirect('/groups');
});


module.exports = router;


db.all("SELECT id, groupname, parent_id FROM groups", function (err, results) {
            if (err) console.error(err.toString());
            console.log(results)
})