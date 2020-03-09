const router = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('inventory1.db');

const dbFunctions = require('../model/dbfunctions');
const Warehouse = require('../model/warehouse');
const warehouse = new Warehouse();

let error;

router.get('/', (req, res) => {
    // dbFunctions.getWhs(req, res, error);
    (async function(){
        warehouse.getAllWh(req, res, error)
      })();
    
})

router.post('/addWh', (req, res) =>{
    const { wh_name, wh_address } = req.body;
    
    dbFunctions.addWh(req, res, wh_name, wh_address, error);  
});


router.post('/editWh', (req, res) =>{
    const { id, wh_name, wh_address } = req.body;
    
    dbFunctions.editWh(req, res, id, wh_name, wh_address, error);    
})


router.post('/delWh', (req, res) =>{
    const { id } = req.body;
    dbFunctions.delWh(req, res, id, error)    
})


module.exports = router;