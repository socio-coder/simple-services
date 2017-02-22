var builder = require('botbuilder');
var webhooks = require('./webhooks/webhooks');
var nodger = require('./services/nodger');
nodger.configure({
    fileLog: {
        status: true,
        path: "./conversationLogs.log"
    },
    httpLog: {
        status: false,
        host: "localhost",
        port: "9800"
    }

});


/*importing intents */
var greeting = require('./intents/greeting');
var hotel = require('./intents/hotel');
var room = require('./intents/room');
var activity = require('./intents/activity');
var places = require('./intents/places');


var chatConnector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(chatConnector);

var nlpModel = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/79c2d9fc-83c2-44be-a6e5-f28b3316ae43?subscription-key=7d28d1d8006a4a2b8cf7945c316e8116&verbose=true";
var recognizer = new builder.LuisRecognizer(nlpModel);
var intent = new builder.IntentDialog({ recognizers: [recognizer] });

// bot.library(require('./dialogs/profile'));

// bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));
// bot.use(builder.Middleware.firstRun({ version: 1.0, dialogId: 'profile:/', upgradeDialogId: 'profile:/' }));

bot.use({
    botbuilder: function(session, next) {
        // console.log(session.message.entities[0].geo.latitude, session.message.entities[0].geo.longitude);
        // console.log(session);
        var logData = {
            // channel: session.dialogData.BotBuilder.Data
            channelId: session.message.address.channelId,
            username: session.message.user.name,
            message: session.message.text
                // intent: session.dialogData['BotBuilder.Data.Intent']
        };
        // console.log(session.message);
        // console.log("Channel ID: " + logData.channelId + " Username: " + logData.username + " Intent: " + logData.intent + " Message: " + logData.message)
        // nodger.log("Channel ID: "+logData.channelId + " Username: " + logData.username +" Intent: "+intent+" Message: " + logData.message);
        console.log("--------------------------------")
        next();
    }
});

bot.dialog('/', intent);


intent.matches('greeting', function(session) { greeting(session, builder); });
intent.matches('hotel.bookroom', [
    function(session, args, next) { hotel.getHotels(session, args, next, builder) },
    function(session, results) { hotel.getHotels01(session, results, builder) },
    function(session, results) { hotel.getHotels02(session, results, builder) },
    function(session, results) { hotel.getHotels03(session, results, builder) },
    function(session, results) { hotel.getHotels04(session, results, builder) },
    function(session, results) { hotel.getHotels05(session, results, builder) }
]);
intent.matches('hotel.makebooking', [
    function(session, args, next) { hotel.bookRoom01(session, args, next, builder) },
    function(session, results) { hotel.bookRoom02(session, results, builder) },
    function(session, results) { hotel.bookRoom03(session, results, builder) },
    function(session, results) { hotel.bookRoom04(session, results, builder) },
    function(session, results) { hotel.getCheckinDetails(session, results, builder) }
]);
intent.matches('hotel.getdirection', [
    function(session, args, next) { hotel.getDirection(session, args, next, builder) },
    function(session, results) { hotel.getDirection01(session, results, builder) }
]);
intent.matches('hotel.getbookings', function(session, args, next) { hotel.getBooking(session, args, next, builder) });

intent.matches('food.menu', function(session, args, next) {});

intent.matches('room.device.on', function(session, args, next) { room.lightsOn(session, args, next, builder) });
intent.matches('room.device.off', function(session, args, next) { room.lightsOff(session, args, next, builder) });
intent.matches('room.device.lights', [
    function(session, args, next) { room.lights(session, args, next, builder) },
    function(session, args, next) { room.lights01(session, args, next, builder) }
]);

intent.matches('user.entertain', function(session, args, next) { activity.getEvents(session, args, next, builder) }); // done

intent.matches('places.nearby', [
    function(session, args, next) { places.nearby(session, args, next, builder) },
    function(session, results) { places.nearby01(session, results, builder) }
]);
intent.onDefault(builder.DialogAction.send("Sorry but sometime I don't know what you want and this is that exact moment !!"));

//webhook code

function sendMessage(req, res) {
    var data = req.body;
    webhooks.sendBooking(bot, data).then(function(result) {
        res.status(200).send(result);
    }).catch(function(err) {
        console.log("In catch");
        res.status(400).send(err.message);
    });
}

module.exports = {
    chatConnector: chatConnector,
    sendMessage: sendMessage
};