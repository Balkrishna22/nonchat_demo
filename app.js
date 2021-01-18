const express = require('express')
const router = express.Router();
const app = express();

var cors = require('cors')
var xss = require('xss-clean')

const bodyParser = require('body-parser');

const global = require('./config/global.js');
app.use(xss())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);
require('./routes/routes')(router);


app.listen(global.port, () => {
    console.log('Example app listening at http://localhost:' + global.port)

})