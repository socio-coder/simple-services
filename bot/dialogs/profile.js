var builder = require('botbuilder');

var library = new builder.Library('profile');

var user = {}; // age, gender,UID Number,

library.dialog('/', [
    function(session) {
        user.name = session.message.user.name;
        user.channel = {};
        user.channel.userId = session.message.user.id;
        user.channel.channelId = session.message.address.channelId;
        user.channel.serviceUrl = session.message.address.serviceUrl;
        session.send("As this is our first interaction, i need to know something about you to provide you a better service.");
        builder.Prompts.number(session, 'What is your contact number?');
    },
    function(session, results) {
        user.phone = results.response;
        builder.Prompts.text(session, 'What is your email address?');
    },
    function(session, results) {
        user.email = results.response;
        builder.Prompts.text(session, 'How old are you ?');
    },
    function(session, results) {
        user.age = results.response;
        var buttonsList = ['Male', 'Female'];
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                .buttons(buttonsList)
            ]);
        builder.Prompts.choice(session, "Are you ", buttonsList);
    },
    function(session, results) {
        user.gender = results.response;

    }
]);

module.exports = library;