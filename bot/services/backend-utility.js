// var syncRequest = require('sync-request');
var chronoNode = require('chrono-node');
var url = "";

function getHotels(userId, location, rating, dates, purpose) {
    if (typeof dates[0] != "string") {
        dates[0] = dates[0].entity;
    }
    if (typeof dates[1] != "string") {
        dates[1] = dates[1].entity;
    }
    for (var i in dates) {
        dates[i] = chronoNode.parseDate(dates[i]);
    }
    console.log(userId, location, rating, dates, purpose);
}

module.exports = {
    getHotels: getHotels
}