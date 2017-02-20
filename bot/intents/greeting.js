module.exports = function(session) {
    console.log(JSON.stringify(session.message.address));
    session.send("Hi " + session.message.user.name + " !");
}