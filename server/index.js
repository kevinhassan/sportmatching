const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
// const logger = require('morgan');
const app = express();

require('dotenv').config();

app.use(express.static(path.join(__dirname, '/doc-api')));

// Middlewares
// app.use(logger('dev'));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // Custom headers
    res.header('Access-Control-Allow-Headers', 'Content-Type,Accept,X-Access-Token,X-Key');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/api/v1/register',require('./routes/register'));
app.use('/api/v1/login', require('./routes/login'));

app.all('/api/v1/*',  [require('./middlewares/validateRequest')]);

app.use('/api/v1', require('./routes/'));

// If no route is matched, send a 404
app.use(function(req, res, next){
    res.status(404).send({
        "status": 404,
        "message": "Not found !"
    });
});

// Start the server

app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'), "0.0.0.0", function() {
    console.log('Server listening on ' + "http://127.0.0.1:" + server.address().port);
});