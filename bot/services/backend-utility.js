// var syncRequest = require('sync-request');
var chronoNode = require('chrono-node');
var httpService = require('./http-services');


function signUp(user) {
    return "success";
}

function getHotels(userId, location, rating, dates, purpose) {
    var url = "http://localhost:8080/xenia/v1/hotels";
    if (typeof dates[0] != "string") {
        dates[0] = dates[0].entity;
    }
    if (typeof dates[1] != "string") {
        dates[1] = dates[1].entity;
    }
    for (var i in dates) {
        dates[i] = chronoNode.parseDate(dates[i]);
    }

    switch (rating) {
        case '5 star':
            rating = 5;
            break;
        case '4 star':
            rating = 4;
            break;
        case '3 star':
            rating = 3;
            break;
        case 'all':
            rating = 0;
            break;
        default:
            console.log("Error: In rating switch");

    }
    console.log("Search details :[", location, rating, dates[0], dates[1], purpose);

    var data = {
        "checkinDate": dates[0],
        "checkoutDate": dates[1],
        "city": location,
        "purpose": purpose,
        "starRating": rating,
        "userId": userId
    };

    var hotels = JSON.parse(httpService.post(url, data));
    return hotels;
}

function getHotel(hotelCode) {

}

module.exports = {
    getHotels: getHotels,
    getHotel: getHotel
}