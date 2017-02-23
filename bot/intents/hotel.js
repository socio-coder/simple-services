var backendUtility = require('../services/backend-utility');
var memoryUtility = require('../services/memory-utility');
var builder = require('botbuilder');
var location;
var dates = [];
var rating;
var purpose;

var getHotels = function(session, args, next, builder) {
    console.log("Searching for hotels Initiated.");
    location = builder.EntityRecognizer.findEntity(args.entities, 'location');
    dates = builder.EntityRecognizer.findAllEntities(args.entities, 'builtin.datetime.date');
    rating = builder.EntityRecognizer.findEntity(args.entities, 'rating');
    purpose = builder.EntityRecognizer.findEntity(args.entities, 'purpose');
    if (!location) {
        if (memoryUtility.isFreshConversation(session.userData.stMem)) {
            var remberedHotels = memoryUtility.rememberInfoBySubject(session.userData.ltMem, 'hotel.name');
            if (remberedHotels.length != 0) {
                session.send("Please enter the city ?  🌇");
                var buttonsList = [];
                remberedHotels.forEach(function(element) {
                    buttonsList.push(builder.CardAction.imBack(session, element, element));
                }, this);
                var msg = new builder.Message(session).attachments([new builder.HeroCard(session).text("Last time you searched").buttons(buttonsList)]);
                builder.Prompts.text(session, msg);
            } else {
                builder.Prompts.text(session, "Please enter the city ? 🌇🌇");
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
    console.log("Location:", location);
    session.userData.ltMem = memoryUtility.updateLTMem(session.userData.ltMem, { subject: 'hotel.name', content: location });
    session.save();
    if (!purpose) {
        var buttonsList = ['Business', 'Personal'];
        builder.Prompts.choice(session, " What is your purpose ? 💼 🎉", buttonsList);
    } else {
        next({ response: purpose });
    }
};
var getHotels02 = function(session, results, builder) {
    purpose = results.response.entity || results.response;
    console.log("Purpose:", purpose);
    if (!rating) {
        var buttonsList = ['5 star', '4 star', '3 star', 'all'];
        builder.Prompts.choice(session, "What is your preference ?", buttonsList);
    } else {
        next({ response: rating });
    }
};
var getHotels03 = function(session, results, builder) {
    rating = results.response.entity || results.response;
    console.log("Rating:", rating);
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
    console.log("Based on input status selecting date");
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
    console.log("Dates:", dates);
    showHotels(session, builder, location, rating, dates, purpose);
}

var showHotels = function(session, builder, location, rating, dates, purpose) {
    session.userData.searchDetail = {};
    session.userData.searchDetail.location = location;
    session.userData.searchDetail.dates = dates;
    session.userData.searchDetail.purpose = purpose;
    session.save();
    console.log("Getting hotels [", session.message.user.id, location, rating, dates, purpose, session.message.user.id, "]");
    var hotels = backendUtility.getHotels(session.message.user.id, location, rating, dates, purpose, session.message.user.id);
    if (hotels) {
        if (hotels.length > 1) {
            var hotelList = [];
            hotels.forEach(function(element) {
                var card = new builder.HeroCard(session)
                    .title(element.name)
                    .text("Rating: " + element.starRating + " User rating: " + element.userRating)
                    .images([
                        builder.CardImage.create(session, element.hotelImage)
                    ]).buttons([
                        builder.CardAction.imBack(session, "Hotel Selected:" + element.hotelCode, element.name)
                    ]);
                hotelList.push(card);
            }, this);
            var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(hotelList);
        } else {
            var msg = "Sorry ! The hotel you are looking for are not available. :'(";
        }
    } else {
        var msg = "Sorry ! The hotel you are looking for are not available. :'(";
    }

    session.send(msg);
};

var hotelCode, roomType, guestName = "";
var hotel;

var bookRoom01 = function(session, args, next, builder) {
    hotelCode = builder.EntityRecognizer.findEntity(args.entities, 'hotelcode').entity;
    console.log("Hotel Code:", hotelCode);
    hotel = backendUtility.getHotel(hotelCode.toUpperCase());
    session.send("Select your type of room ")
    var roomList = [
        new builder.HeroCard(session)
        .title("Deluxe Room")
        .text("Price " + hotel.deluxeRoomRate + " INR")
        .images([
            builder.CardImage.create(session, hotel.deluxeRoomImage)
        ]),
        new builder.HeroCard(session)
        .title("Normal Room")
        .text("Price " + hotel.normalRoomRate + " INR")
        .images([
            builder.CardImage.create(session, hotel.normalRoomImage)
        ])
    ];
    var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(roomList);
    session.send(msg);
    builder.Prompts.choice(session, "which room?", ["Deluxe", "Normal"]);
};

var bookRoom02 = function(session, results, builder) {
    roomType = results.response.entity || results.response;
    console.log("Room type:", roomType);
    builder.Prompts.number(session, "How many people are travelling with you ?");
}

var bookRoom03 = function(session, results, builder) {
    var numberOfCotravellers = results.response.entity || results.response;
    numberOfCotravellers = Number.parseInt(numberOfCotravellers);
    console.log("Number of Co-travellers:", numberOfCotravellers);
    if (numberOfCotravellers > 0) {
        builder.Prompts.text(session, "Please tell me the name of co-travellers?");
    } else {
        makeBooking(session, hotelCode, "2", roomType);
    }
};

var bookRoom04 = function(session, results, builder) {
    guestName = results.response.entity || results.response;
    console.log("Cotraveller Name:", guestName);
    makeBooking(session, hotelCode, "2", roomType, guestName);

};
var bookingId;

var makeBooking = function(session, hotelCode, floorNumber, roomType, guestName) {
    var data = {
        "checkinDate": session.userData.searchDetail.dates[0],
        "checkoutDate": session.userData.searchDetail.dates[1],
        "cotravellers": [guestName],
        "floorNumber": "2",
        "hotelCode": hotelCode.toUpperCase(),
        "purpose": session.userData.searchDetail.purpose,
        "roomType": roomType,
        "userId": Number(session.message.user.id)
    };
    console.log("Making Booking [", session.userData.searchDetail.dates[0], session.userData.searchDetail.dates[1], data.cotravellers, 4, hotelCode.toUpperCase(),
        session.userData.searchDetail.purpose, roomType, Number(session.message.user.id), "]");
    console.log(JSON.stringify(data));
    var bookingDetails = backendUtility.makeBooking(data);
    bookingId = bookingDetails.bookingId;
    var msg = new builder.Message(session)
        .attachments([
            new builder.ReceiptCard(session)
            .title(session.message.user.name)
            .items([
                builder.ReceiptItem.create(session, bookingDetails.totalCost, bookingDetails.hotelName).image(builder.CardImage.create(session, bookingDetails.imageURL)),
            ])
            .facts([
                builder.Fact.create(session, bookingDetails.bookingId, "Order Number"),
                builder.Fact.create(session, "VISA 4076", "Payment Method")
            ])
            .total(bookingDetails.totalCost)
        ]);
    session.send(msg);
    setTimeout(function() {
        builder.Prompts.choice(session, "Will you checkin today ?", ["Yes", "No"]);
    }, 10000);

}

var getCheckingDetails = function(session, results, builder) {
    var answer = results.response.entity || results.response;
    console.log("Checkin answer:", answer);
    var data = {
        "bookingId": bookingId,
        "name": session.message.user.name
    };
    if (answer == "Yes") {
        var checkinDetails = backendUtility.getCheckinDetails(data);
        var imageUrl = checkinDetails.qrCode.qrcodeLink;
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
        session.endDialog();
    } else {
        session.send("Your booking has been cancelled. Hope you will choose us for next stay.");
    }
}

var getDirection = function(session, args, next, builder) {
    builder.Prompts.text(session, "Please provide your location.");
};
var getDirection01 = function(session, results, builder) {
    try {
        var lat = session.message.entities[0].geo.latitude;
        var long = session.message.entities[0].geo.longitude;
        console.log("Location recieved [", "lat", lat, "long", long, "]");
        var directions = backendUtility.getDirection(session.message.user.id);
        // var button = builder.CardAction.openUrl(session, "https://www.google.co.in/maps/dir/" + lat + "," + long + "/" + directions.locationCoordinates, "Open in maps");
        var button = builder.CardAction.openUrl(session, "https://www.google.co.in/maps/dir/" + lat + "," + long + "/12.9731271,77.6467923", "Open in maps");
        var msg = new builder.Message(session).attachments([new builder.HeroCard(session).text(directions.hotelName).buttons([button])]);
        session.send(msg);

    } catch (e) {
        console.log(e);
        session.send("Sorry ! Unable to fetch direction at this time :')")
    }
};


module.exports = {
    getHotels: getHotels,
    getHotels01: getHotels01,
    getHotels02: getHotels02,
    getHotels03: getHotels03,
    getHotels04: getHotels04,
    getHotels05: getHotels05,
    bookRoom01: bookRoom01,
    bookRoom02: bookRoom02,
    bookRoom03: bookRoom03,
    bookRoom04: bookRoom04,
    getCheckinDetails: getCheckingDetails,
    getDirection: getDirection,
    getDirection01: getDirection01
        // getBooking: getBooking
};