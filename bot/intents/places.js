var builder = require('botbuilder');
var backendServices = require('../services/backend-utility');


var nearby = function(session, args, next, builder) {
    builder.Prompts.choice(session, "Will you checkin today ?", ["Yes", "No"]);

};
var nearby01 = function(session, results, builder) {
    var answer = results.response.entity || results.response;
    console.log("checkin answer recieved:", answer);
    var data = {
        "bookingId": "95b10a33-4ca2-477e-b16a-8f2072ccbf20",
        "hotelCode": "CISC02",
        "isCheckin": true,
        "name": "Ajit Singh",
        "roomNumber": 0,
        "userId": 1222207907845456
    };
    if (answer == "Yes") {
        var checkinDetails = backendServices.getCheckinDetails(data);
        var imageUrl = checkinDetails.qrCode.qrcodeLink;
        console.log(imageUrl);
        var card = new builder.HeroCard(session)
            .title("Booking QR Code")
            .text("Please scan this qr code at Kiosk at hotel reception.")
            .images([
                builder.CardImage.create(session, checkinDetails.qrCode.qrcodeLink)
            ])
            .tap(builder.CardAction.openUrl(session, checkinDetails.qrCode.qrcodeLink));
        var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments([card]);
        session.send(msg);
        session.send("Your room number is " + checkinDetails.roomNumber);
        session.send(checkinDetails.weatherMessage);

    } else {
        session.send("Your booking has been cancelled. Hope you will choose us for next stay.");
    }

}

module.exports = {
    nearby: nearby,
    nearby01: nearby01
}