var chronoNode = require('chrono-node');
// var backendUtility = require('../services/backend-utility');

var location;
var dates;
var rating;
var purpose;
var getHotels = function(session, args, next, builder) {

    location = builder.EntityRecognizer.findEntity(args.entities, 'location');
    dates = builder.EntityRecognizer.findAllEntities(args.entities, 'builtin.datetime.date');
    rating = builder.EntityRecognizer.findEntity(args.entities, 'rating');
    purpose = builder.EntityRecognizer.findEntity(args.entities, 'purpose');
    if (!location) {
        builder.Prompts.text(session, "Please enter the city ?");
    } else {
        next({ response: location.entity });
    }
};
var _getHotels = function(session, results, builder) {
    location = results.response;
    if (!purpose) {
        session.send("What is your purpose ?");
        var buttonsList = ['Business', 'Personal'];
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                .buttons(buttonsList)
            ]);
        builder.Prompts.choice(session, "Select one please..", buttonsList);
    } else {
        next({ response: purpose.entity });
    }
};
var __getHotels = function(session, results, builder) {
    purpose = results.response;
    if (!rating) {
        ession.send("What is your preference ?");
        var buttonsList = ['5 star', '4 start', '3 star', 'all'];
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                .buttons(buttonsList)
            ]);
        builder.Prompts.choice(session, "Select one please..", buttonsList);
    } else {
        next({ response: rating.entity });
    }
};
var ___getHotels = function(session, results, builder) {
    rating = results.response;
    session.send("You have selected", location, rating, purpose);

    // if (dates) {
    //     if (dates.length == 0) {
    //         builder.Prompts.text(session, "Please enter your check in date.");
    //     } else {
    //         if (dates.length == 1) {
    //             builder.Prompts.text(session, "Please enter another date.");
    //         } else {
    //             if (dates.length == 2)
    //         }
    //     }
    // }
};


var bookRoom = function(session, args, next, builder) {

};
var _bookRoom = function(session, results, builder) {

};

var getBooking = function(session, args, next, builder) {

};

module.exports = {
    getHotels: getHotels,
    _getHotels: _getHotels,
    __getHotels: __getHotels,
    ___getHotels: ___getHotels
        // bookRoom: bookRoom,
        // _bookRoom: _bookRoom,
        // getBooking: getBooking
};