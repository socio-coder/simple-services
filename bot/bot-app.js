var builder = require('botbuilder');

/*importing intents */
var greeting = require('./intents/greeting');
var hotel = require('./intents/hotel');
var room = require('./intents/room');
var activity = require('./intents/activity');

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

bot.dialog('/', intent);


intent.matches('greeting', function(session) { greeting(session, builder); });
intent.matches('hotel.bookroom', [
    function(session, args, next) { hotel.getHotels(session, args, next, builder) },
    function(session, results) { hotel._getHotels(session, results, builder) },
    function(session, results) { hotel.__getHotels(session, results, builder) },
    function(session, results) { hotel.___getHotels(session, results, builder) }
]);
intent.matches('hotel.getbookings', function(session, args, next) { hotel.getBooking(session, args, next, builder) });
intent.matches('food.menu', function(session, args, next) {});
intent.matches('room.device.on', function(session, args, next) {});
intent.matches('room.device.off', function(session, args, next) {});
intent.matches('room.device.lights', function(session, args, next) {});
intent.matches('user.entertain', function(session, args, next) {});
intent.matches('places.nearby', function(session, args, next) {});
intent.onDefault(builder.DialogAction.send("Sorry but sometime I don't know what you want and this is that exact moment !!"));

module.exports = {
    chatConnector: chatConnector
};