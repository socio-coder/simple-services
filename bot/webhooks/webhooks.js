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
            console.log(">>>>>>>>>>WebHook:::", session);
            var msg = new builder.Message()
                .address(address)
                .text("Hi! " + content.name + " has made a booking with you, here are the booking details")
            bot.send(msg, function(done) {
                console.log("Web hook msg sent");
                resolve("Message sent.");
            });
            var checkinDate = new Date(content.checkinDate).getDate() + "-" + (new Date(content.checkinDate).getMonth() + 1) + "-" + new Date(content.checkinDate).getFullYear();
            var checkoutDate = new Date(content.checkoutDate).getDate() + "-" + (new Date(content.checkoutDate).getMonth() + 1) + "-" + new Date(content.checkoutDate).getFullYear();
            var card = new builder.ThumbnailCard(session)
                .title('Hotel Name: ' + content.hotelName)
                .subtitle('Check in: ' + checkinDate + '\nCheck out: ' + checkoutDate + '\nCity: ' + content.city);
            msg = new builder.Message()
                .address(address)
                .addAttachment(card);
            bot.send(msg, function(done) {
                console.log("Web hook msg sent");
                resolve("Message sent.");
            });
        } else {
            reject("Message body not found");
        }
    });
};

module.exports = {
    sendBooking: sendBooking
};