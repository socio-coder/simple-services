var express = require('express');
var bodyParser = require('body-parser');


/** ****************************************/
// var globalTunnel = require('global-tunnel');
// process.env.http_proxy = 'http://proxy:443';
// process.env.https_proxy = 'http://proxy:443';
// globalTunnel.initialize();
// globalTunnel.end();
/** ****************************************/

var router = require('./route.js');

var server = express();
server.use(bodyParser.json())
server.use('/', router);
server.use('/', express.static('site'));

server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('Server is listening..');
});