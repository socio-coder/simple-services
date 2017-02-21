var builder = require('botbuilder');

var nearby = function(session, args, next, builder) {
    builder.Prompts.text(session, "Please provide your location.");

};
var nearby01 = function(session, results, builder) {

    try {
        var lat = session.message.entities[0].geo.latitude;
        var long = session.message.entities[0].geo.longitude;
        console.log("lat", lat, "long", long);
        var button = builder.CardAction.openUrl(session, "https://www.google.co.in/maps/dir/" + lat + "," + long + "/12.9731271,77.6467923", "Open in maps");
        var msg = new builder.Message(session).attachments([new builder.HeroCard(session).text("Please click here to view on map").buttons([button])]);
        session.send(msg);

    } catch (e) {
        console.log(e);
        session.send("Sorry !")
    }
}

module.exports = {
    nearby: nearby,
    nearby01: nearby01
}