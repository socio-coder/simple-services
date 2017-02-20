var express = require('express');
var router = express.Router();

var botApp = require('./bot/bot-app');

router.post('/api/bot/messages', botApp.chatConnector.listen());
router.post('/api/user/messages', function(req, res) { botApp.sendMessage(req, res) });

module.exports = router;