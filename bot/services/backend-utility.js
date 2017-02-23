// var syncRequest = require('sync-request');
var chronoNode = require('chrono-node');
var httpService = require('./http-services');

var backendAddress = "http://localhost:8080";

function getHotels(userId, location, rating, dates, purpose) {

    var url = backendAddress + "/xenia/v1/hotels";
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
    var url = backendAddress + "/xenia/v1/hotel?hotelCode=" + hotelCode;
    console.log(url);
    var hotel = JSON.parse(httpService.get(url));
    return hotel;
}

function makeBooking(data) {
    var url = backendAddress + "/xenia/v1/bookings";
    console.log(url);
    var bookingResponse = JSON.parse(httpService.post(url, data));
    console.log(bookingResponse);
    return bookingResponse;
}

function getCheckinDetails(data) {
    var url = backendAddress + "/xenia/v1/qrCode";
    console.log("Getting check in details from Url:", url);
    var checkinData = JSON.parse(httpService.post(url, data));
    console.log("Got checkin data:", checkinData);
    return checkinData;
};

function getDirection(userId) {
    var url = backendAddress + "/xenia/v1/directions?userId=" + userId;
    console.log("Getting direction for hotel.");
    var directions = JSON.parse(httpService.get(url));
    console.log("Direction:", directions);
    return directions;
};

module.exports = {
    getHotels: getHotels,
    getHotel: getHotel,
    makeBooking: makeBooking,
    getCheckinDetails: getCheckinDetails,
    getDirection: getDirection
}