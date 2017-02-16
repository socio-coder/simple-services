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

    // if (dates.length < 2) {
    //     console.log("Both dates not present");
    // }

    // if (!rating) {
    //     console.log("Rating not present");
    // }

};
var _bookRoom = function(session, results, builder) {
    location = results.response;
    console.log("You asked for", location);
    session.send("You asked for", location);
    // if (dates) {
    //     if (dates.length == 0) {
    //         session.dialogData.
    //         builder.Prompts.text(session, "Please provide checkin date ?");
    //     }
    // }
};

var getBooking = function(session, args, next, builder) {

};

module.exports = { bookRoom: bookRoom, _bookRoom: _bookRoom, getBooking: getBooking };