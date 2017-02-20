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
                var msg = new builder.Message(session).attachments([new builder.HeroCard(session).text("Last time you searched").buttons(buttonsList)]);
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
                    showHotels(session, builder, location, rating, dates, purpose);
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
            showHotels(session, builder, location, rating, dates, purpose);
            break;
        default:
            session.send("Something wrong with me, I need to talk to my developer !!");

    }
};
var getHotels05 = function(session, results, builder) {
    dates.push(results.response);
    showHotels(session, builder, location, rating, dates, purpose);
}

var showHotels = function(session, builder, location, rating, dates, purpose) {
    console.log("Inside show hotels");
    session.userData.searchDetail = {};
    session.userData.searchDetail.location = location;
    session.userData.searchDetail.dates = dates;
    session.userData.searchDetail.purpose = purpose;
    session.save();
    var hotels = backendUtility.getHotels(session.message.user.id, location, rating, dates, purpose, session.message.user.id);
    var hotelList = [];
    hotels.forEach(function(element) {
        var card = new builder.HeroCard(session)
            .title(element.name)
            .text("Rating: " + element.starRating + " User rating: " + element.userRating)
            .images([
                builder.CardImage.create(session, element.hotelImage)
            ]).buttons([
                builder.CardAction.imBack(session, "Hotel Selected:" + element.hotelCode, "Select")
            ]);
        hotelList.push(card);
    }, this);
    var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(hotelList);
    session.send(msg);
};

var hotelcode, floorNumber, roomType, guestName;

var bookRoom = function(session, args, next, builder) {
    hotelCode = builder.EntityRecognizer.findEntity(args.entities, 'hotelcode').entity;
    console.log("Getting details for hotel Code:", hotelCode);
    console.log("Saved search details", session.userData.searchDetail);
    var hotel = backendUtility.getHotel(hotelCode);
    builder.Prompts.choice(session, "Choose your floor number ?", hotel.floors);
};
var bookRoom01 = function(session, results, builder) {
    floorNumber = results.response.entity || results.response;
    var roomList = [
        new builder.HeroCard(session)
        .title("Deluxe Room")
        .text("Price " + hotel.deluxeRoomRate + " INR")
        .images([
            builder.CardImage.create(session, hotel.deluxeRoomImage)
        ]),
        new builder.HeroCard(session)
        .title("Normal Room")
        .text("Price " + hotel.deluxeRoomRate + " INR")
        .images([
            builder.CardImage.create(session, hotel.normalRoomImage)
        ])
    ];
    var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(roomList);
    session.send(msg);
    builder.Prompts.choice(session, "Which Room", ["Deluxe", "Normal"]);
};

var bookRoom02 = function(session, results, builder) {
    roomType = results.response.entity || results.response;
    builder.Prompts.number(session, "How many guests ?");
}

var bookRoom03 = function(session, results, builder) {
    var numberOfGuests = results.response.entity || results.response;
    if (numberOfGuests != "1") {
        builder.Prompts.text(session, "Please tell me the name of other guest ?");
    } else {
        makeBooking(session, hotelCode, floorNumber, roomType);
    }
};

var bookRoom04 = function(session, results, builder) {
    guestName = results.response.entity || results.response;
    makeBooking(session, hotelCode, floorNumber, roomType, guestName);

};

var makeBooking = function(session, hotelCode, floorNumber, roomType, guestName) {
    var data = {
        "checkinDate": session.userData.searchDetail.dates[0],
        "checkoutDate": session.userData.searchDetail.dates[1],
        "cotravellers": [guestName],
        "floorNumber": floorNumber,
        "hotelCode": hotelCode,
        "purpose": session.userData.searchDetail.purpose,
        "roomType": roomType,
        "userId": session.message.user.id
    };
    var bookingDetails = backendUtility.makeBooking(data);
    console.log(bookingDetails);
}

module.exports = {
    getHotels: getHotels,
    getHotels01: getHotels01,
    getHotels02: getHotels02,
    getHotels03: getHotels03,
    getHotels04: getHotels04,
    getHotels05: getHotels05,
    bookRoom: bookRoom,
    bookRoom01: bookRoom01,
    bookRoom02: bookRoom02,
    bookRoom03: bookRoom03,
    bookRoom04: bookRoom04
        // getBooking: getBooking
};