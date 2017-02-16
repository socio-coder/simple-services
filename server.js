var express = require('express');

var router = require('./route.js');

var server = express();

server.use('/', router);
server.use('/', express.static('site'));

server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('Server is listening..');
});