var backendUtility = require('../services/backend-utility');
var memoryUtility = require('../services/memory-utility');

var location;
var dates = [];
var rating;
var purpose;

var getHotels = function(session, args, next, builder) {

    location = builder.EntityRecognizer.findEntity(args.entities, 'location');
    dates = builder.EntityRecognizer.findAllEntities(args.entities, 'builtin.datetime.date');
    rating = builder.EntityRecognizer.findEntity(args.entities, 'rating');
    purpose = builder.EntityRecognizer.findEntity(args.entities, 'purpose');
    if (!location) {
        if (memoryUtility.isFreshConversation(session.userData.stMem)) {
            var remberedHotels = memoryUtility.rememberInfoBySubject(session.userData.ltMem, 'hotel.name');
            console.log(remberedHotels);
            if (remberedHotels.length != 0) {
                session.send("Please enter the city ?")
                var buttonsList = [];
                remberedHotels.forEach(function(element) {
                    buttonsList.push(builder.CardAction.imBack(session, element, element));
                }, this);
                var msg = new builder.Message(session).attachments([new builder.HeroCard(session).text("Last time you searched for these.").buttons(buttonsList)]);
                builder.Prompts.text(session, msg);
            } else {
                builder.Prompts.text(session, "Please enter the city ?");
            }
        } else {
            next({ response: session.userData.stMem.content });
        }
    } else {
        next({ response: location });
    }
};
var getHotels01 = function(session, results, builder) {
    location = results.response.entity || results.response;
    session.userData.ltMem = memoryUtility.updateLTMem(session.userData.ltMem, { subject: 'hotel.name', content: location });
    session.save();
    if (!purpose) {
        var buttonsList = ['Business', 'Personal'];
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                .buttons(buttonsList)
            ]);
        builder.Prompts.choice(session, "What is your purpose ?", buttonsList);
    } else {
        next({ response: purpose });
    }
};
var getHotels02 = function(session, results, builder) {
    purpose = results.response.entity || results.response;
    if (!rating) {
        var buttonsList = ['5 star', '4 star', '3 star', 'all'];
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                .buttons(buttonsList)
            ]);
        builder.Prompts.choice(session, "What is your preference ?", buttonsList);
    } else {
        next({ response: rating });
    }
};
var getHotels03 = function(session, results, builder) {
    rating = results.response.entity || results.response;
    if (dates) {
        if (dates.length == 0) {
            session.dialogData.inputStatus = 0;
            builder.Prompts.text(session, "Please enter your check in date.");
        } else {
            if (dates.length == 1) {
                session.dialogData.inputStatus = 1;
                builder.Prompts.text(session, "Please enter another date.");
            } else {
                if (dates.length == 2) {
                    var hotels = backendUtility.getHotels('1234', location, rating, dates, purpose);
                    showHotels(session, hotels, builder);
                    // session.dialogData.inputStatus = 2;
                    // next({ response: rating.entity });
                }
            }
        }
    }
};
var getHotels04 = function(session, results, builder) {
    switch (session.dialogData.inputStatus) {
        case 0:
            dates.push(results.response);
            builder.Prompts.text(session, "Please enter your check out date.");
            break;
        case 1:
            dates.push(results.response);
            var hotels = backendUtility.getHotels('1234', location, rating, dates, purpose);
            showHotels(session, hotels, builder);
            break;
        default:
            session.send("Something wrong with me, I need to talk to my developer !!");

    }
};
var getHotels05 = function(session, results, builder) {
    dates.push(results.response);
    var hotels = backendUtility.getHotels('1234', location, rating, dates, purpose);
    showHotels(session, hotels, builder);
}

var showHotels = function(session, hotels, builder) {
    console.log("Inside show hotels.")

};

var bookRoom = function(session, args, next, builder) {

};
var _bookRoom = function(session, results, builder) {

};

var getBooking = function(session, args, next, builder) {

};

module.exports = {
    getHotels: getHotels,
    getHotels01: getHotels01,
    getHotels02: getHotels02,
    getHotels03: getHotels03,
    getHotels04: getHotels04,
    getHotels05: getHotels05
        // bookRoom: bookRoom,
        // _bookRoom: _bookRoom,
        // getBooking: getBooking
};