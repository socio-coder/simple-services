module.exports = function(session){
    session.send("Hi "+session.message.user.name+" !");
}