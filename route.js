var express = require('express');
var router = express.Router();

var botApp = require('./bot/bot-app');

router.post('/api/bot/messages', botApp.chatConnector.listen());

module.exports = router;