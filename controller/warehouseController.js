const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory1.db');

const dbFunctions = require('../model/dbfunctions');
const warehouse = require('../model/warehouse');

let error;

router.get('/', (req, res) => {
    (async () => {
        const results = await warehouse.getAllWhs(req, res, error)
        res.render(`warehouse`, {
              pageTitle: 'Raktarak',
              warehouses: results,
              error: error
          });
        error = undefined;
      })();
    
})

router.post('/addWh', (req, res) =>{
    const { wh_name, wh_address } = req.body;
    (async () => {
      const result = await warehouse.addWh(req, res, wh_name, wh_address, error);
      if (result !== 'success') error = result; // ha nem sikerult akkor a globalis error valtozot egyenleove teszem a hibauzenettel, amit majd egy error modal megjelenit amikor visszarendereli a weboldalt
      res.redirect('/warehouses');
    })();
    
});


router.post('/editWh', (req, res) =>{
    const { id, wh_name, wh_address } = req.body;
    (async () => {
      const result = await warehouse.editWh(req, res, id, wh_name, wh_address, error);
      if (result !== 'success') error = result;
      res.redirect('/warehouses');
    })();
    // dbFunctions.editWh(req, res, id, wh_name, wh_address, error);    
})


router.post('/delWh', (req, res) =>{
    const { id } = req.body;
    (async () => {
      const result = await warehouse.delWh(req, res, id, error)
      if (result !== 'success') error = result;
      res.redirect('/warehouses');
    })();
    // dbFunctions.delWh(req, res, id, error)    
})


module.exports = router;