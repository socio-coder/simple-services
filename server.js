var builder = require('botbuilder');
var express = require('express');
var server = express();

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/79c2d9fc-83c2-44be-a6e5-f28b3316ae43?subscription-key=7d28d1d8006a4a2b8cf7945c316e8116&q=';
var recognizer = new builder.LuisRecognizer(model);
var intent = new builder.IntentDialog({
    recognizers: [recognizer]
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', intent);

server.post('/api/messages', connector.listen());
server.use('/', express.static('site'));

server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('Server is listening..');
});