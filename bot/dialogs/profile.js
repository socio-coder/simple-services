var builder = require('botbuilder');

var library = new builder.Library('profile');

var user = {};

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
        // mongoClient.registerUser(user, function(err, response) {
        //     if (err) session.send("Registration process failed. Please try again later.");
        //     if (!response.success) session.endDialog(response.result.message + "so we will do it later. Now how can I help you?");
        //     if (response.success) session.endDialog(response.result.message + " Thank you for sharing your details. Now how can I help you?");
        // });
    }
]);

module.exports = library;