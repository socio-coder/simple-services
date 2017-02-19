var activities = [{
        title: "Games Room",
        text: "Checkout our games room on 1st floor",
        imageUrl: "https://project-xenia-images.herokuapp.com/events/games-room.jpg"
    },
    {
        title: "Swimming Pool",
        text: "Go for a refreshing swim at our roof top swimmig pool",
        imageUrl: "https://project-xenia-images.herokuapp.com/events/swimming-pool.jpg"
    },
    {
        title: "Spa",
        text: "Its time to relax your soul and body.",
        imageUrl: "https://project-xenia-images.herokuapp.com/events/spa.jpg"
    },
    {
        title: "Cocktail Party",
        text: "Come and drink with us at the bar on the Ground Floor",
        imageUrl: "https://project-xenia-images.herokuapp.com/events/cocktail-party.jpg"
    },
    {
        title: "Karaoke Night",
        text: "Its time to let out your inner talent.",
        imageUrl: "https://project-xenia-images.herokuapp.com/events/karaoke.jpg"
    }

];



var getEvents = function(session, args, next, builder) {
    session.send("Why don't you try these..");
    var cardList = [];
    activities.forEach(function(element) {
        var card = new builder.HeroCard(session)
            .title(element.title)
            .text(element.text)
            .images([
                builder.CardImage.create(session, element.imageUrl)
            ]);
        cardList.push(card);

    }, this);
    var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(cardList);
    session.send(msg);
};

module.exports = {
    getEvents: getEvents
}