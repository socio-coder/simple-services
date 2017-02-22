var Promise = require('bluebird');
var builder = require('botbuilder');

function sendBooking(bot, data) {
    return new Promise(function(resolve, reject) {
        if (data) {
            var userId = data.userId;
            var content = data.content;
            var address = {
                channelId: "facebook",
                user: { id: userId },
                bot: { id: "1872692346333930", name: "xenia" },
                serviceUrl: "https://facebook.botframework.com",
                useAuth: true,
            }
            var session = builder.Session({ library: '', dialogId: new Date() });
            var msg = new builder.Message()
                .address(address)
                .text("Hi! " + content.name + " has made a booking with you, here are the booking details")
            bot.send(msg, function(done) {
                console.log("Web hook msg sent");
                resolve("Message sent.");
            });
            var card = new builder.ThumbnailCard(session)
                .title('Hotel Name: ' + content.hotelName)
                .subtitle('Check in: ' + content.checkinDate + '\nCheck out: ' + content.checkOutDate + '\nCity: Mysore')
            msg = new builder.Message()
                .address(address)
                .addAttachment(card);
            bot.send(msg, function(done) {
                console.log("Web hook msg sent");
                resolve("Message sent.");
            });
        } else {
            res.send('<p>Error: Message body not found.</p>');
        }
    });
};

module.exports = {
    sendBooking: sendBooking
};