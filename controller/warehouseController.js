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
      const result = await warehouse.addWh(req, res, wh_name, wh_address).catch(error => console.log(error));
      if (result !== 'success') error = 'Nem sikerult hozzaadni a raktarat, mert nem minden mezo volt kitoltve.';
      res.redirect('/warehouses');
    })();
    
});


router.post('/editWh', (req, res) =>{
    const { id, wh_name, wh_address } = req.body;
    (async () => {
      const result = await warehouse.editWh(req, res, id, wh_name, wh_address, error).catch(error => console.log(error));
      if (result !== 'success') error = 'Nem sikerult szerkeszteni a raktar tulajdonsagait, mert nem minden mezo volt kitoltve.';
      res.redirect('/warehouses');
    })();   
})


router.post('/delWh', (req, res) =>{
    const { id } = req.body;
    (async () => {
      const result = await warehouse.delWh(req, res, id, error).catch(error => console.log(error));
      if (result !== 'success') error = `Ez a raktar nem ures, igy nem tudjuk torolni az adatbazisbol`;
      res.redirect('/warehouses');
    })();
    // dbFunctions.delWh(req, res, id, error)    
})


module.exports = router;