const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const port = 3000;

const product = require('./controller/productsController');
const storage = require('./controller/storageController');
const group = require('./controller/groupsController');

app.use(express.json());
app.use(express.urlencoded( { extended: true} ) );

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))


app.get('/product', product.product);
app.post('/product', product.addProduct);
app.post('/editProduct', product.editProduct);
app.post('/deleteProduct', product.deleteProduct);



app.use('/storage', storage);
app.use('/groups', group);



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

