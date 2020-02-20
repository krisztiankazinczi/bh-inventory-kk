const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const port = 3000;

const product = require('./controller/productsController')

app.use(express.json());
app.use(express.urlencoded( { extended: true} ) );

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))


app.get('/', product);






app.listen(port, () => console.log(`Example app listening on port ${port}!`));

