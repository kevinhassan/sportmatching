// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var port =  8080;


// configuration =====================================

app.use('/node_modules', express.static(__dirname + '/node_modules/'));
// set the static files location
app.use(express.static(__dirname + '/app'));
app.use('/bower_components', express.static(__dirname + '/app/bower_components'));

// listen (start app with node server.js) ======================================
app.set('port', process.env.PORT || 8080);

const server = app.listen(app.get('port'), "0.0.0.0", function() {
    console.log('Server listening on ' + "http://127.0.0.1:" + server.address().port);
});
