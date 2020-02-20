const products = require('../model/products');

function product(req, res) {
    res.render('products', {products: products});
}

module.exports = product;