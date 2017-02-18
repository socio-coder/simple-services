var location;
var dates;
var rating;
var bookRoom = function(session, args, next, builder) {

    location = builder.EntityRecognizer.findEntity(args.entities, 'location');
    dates = builder.EntityRecognizer.findAllEntities(args.entities, 'builtin.datetime.date');
    rating = builder.EntityRecognizer.findEntity(args.entities, 'rating');
    if (!location) {
        console.log("Location not present");
        builder.Prompts.text(session, "Please enter the city ?");
    } else {
        next({ response: location.entity });
    }
};
var _bookRoom = function(session, results, builder) {
    var card1 = new builder.HeroCard(session)
        .title("Hotel Residency")
        .text("Hotel Residency is a lot awesome.")
        .images([
            builder.CardImage.create(session, "https://project-xenia-images.herokuapp.com/fab-normal.png")
        ]).buttons([
            builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
            builder.CardAction.imBack(session, "select:100", "Select")
        ]);
    var card2 = new builder.HeroCard(session)
        .title("Hotel Residency")
        .text("Hotel Residency is a lot awesome.")
        .images([
            builder.CardImage.create(session, "https://project-xenia-images.herokuapp.com/fab-deluxe.png")
        ]).buttons([
            builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
            builder.CardAction.imBack(session, "select:100", "Select")
        ]);
    var card3 = new builder.HeroCard(session)
        .title("Hotel Residency")
        .text("Hotel Residency is a lot awesome.")
        .images([
            builder.CardImage.create(session, "https://project-xenia-images.herokuapp.com/fab-hotel.png")
        ]).buttons([
            builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
            builder.CardAction.imBack(session, "select:100", "Select")
        ]);
    var card4 = new builder.HeroCard(session)
        .title("Hotel Residency")
        .text("Hotel Residency is a lot awesome.")
        .images([
            builder.CardImage.create(session, "https://project-xenia-images.herokuapp.com/sample-image.png")
        ]).buttons([
            builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
            builder.CardAction.imBack(session, "select:100", "Select")
        ]);
    var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments([card1, card2, card3, card4]);
    session.send(msg);
    location = results.response;
    console.log("You asked for", location);
    session.send("You asked for " + location);
    // if (dates) {
    //     if (dates.length == 0) {
    //         builder.Prompts.text(session, "Please provide checkin date ?");
    //     }else{

    //     }
    // }
};

var getBooking = function(session, args, next, builder) {

};

module.exports = { bookRoom: bookRoom, _bookRoom: _bookRoom, getBooking: getBooking };