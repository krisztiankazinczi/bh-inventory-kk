const router = require('express').Router();

const warehouse = require('../model/warehouse');

let error;

router.get('/', async (req, res) => {
    let results;
        try {
            results = await warehouse.getAllWhs(req, res, error);
        } catch (err) {
            error = err;
        }
        res.render(`warehouse`, {
            pageTitle: 'Raktarak',
            warehouses: results,
            error: error
        });
        error = undefined;    
})

router.post('/addWh', async (req, res) =>{
    const { wh_name, wh_address } = req.body;
    try {
        await warehouse.addWh(req, res, wh_name, wh_address);
    } catch (err) {
        error = err;
    }
    res.redirect('/warehouses');
});


router.post('/editWh', async (req, res) =>{
    const { id, wh_name, wh_address } = req.body;
    try {
        await warehouse.editWh(req, res, id, wh_name, wh_address)
    } catch (err) {
        error = err;
    }
    res.redirect('/warehouses');
})


router.post('/delWh', async (req, res) =>{
    const { id } = req.body;
    try {
        await warehouse.delWh(req, res, id);
    } catch (err) {
        error = err;
    }
    res.redirect('/warehouses');
})


module.exports = router;