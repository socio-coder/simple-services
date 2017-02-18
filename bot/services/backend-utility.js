// var syncRequest = require('sync-request');
var url = "";

function getHotels(userId, location, rating, dates, purpose) {
    if (typeof dates[0] != "string") {
        dates[0] = dates[0].entity;
    }
    if (typeof dates[1] != "string") {
        dates[1] = dates[1].entity;
    }
    console.log(userId, location, rating, dates, purpose);
}

module.exports = {
    getHotels: getHotels
}