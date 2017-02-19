 var smartRoomUtil = require('../services/smart-room-util');

 var lightsOff = function(session, args, next, builder) {
     smartRoomUtil.turnOffLight();
     session.send("I turned off the lights for you.");
 };

 var lightsOn = function(session, args, next, builder) {
     smartRoomUtil.turnOnLight();
     session.send("I turned on the lights for you.");
 };

 var lights = function(session, args, next, builder) {
     var buttonsList = ['No', 'Yes'];
     var msg = new builder.Message(session)
         .textFormat(builder.TextFormat.xml)
         .attachmentLayout(builder.AttachmentLayout.carousel)
         .attachments([
             new builder.HeroCard(session)
             .buttons(buttonsList)
         ]);
     builder.Prompts.choice(session, "Do you want me to turn off the light ?", buttonsList);
 };
 var lights01 = function(session, results, builder) {
     var answer = results.response.entity || results.response;
     console.log("Lights => User said :", answer);
     if (answer == 'Yes' || answer === "Yes") {
         // turning off lights
         smartRoomUtil.turnOffLight();
         session.send("I have turned off the lights and I will inform hotel staff not disturb you !!");
     } else {
         session.send(" Ok then I will inform staff not to distrub you")
     }
 };
 module.exports = {
     lightsOff: lightsOff,
     lightsOn: lightsOn,
     lights: lights,
     lights01: lights01
 };