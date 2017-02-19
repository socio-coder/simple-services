var httpServices = require('./http-services');

var smartRoomDeviceAddress = "http://localhost:5001";
var url = smartRoomDeviceAddress + "/xenia-smart-room-services/v1/devices";


var turnOnLight = function() {
    var data = {
        device: "light",
        action: "on"
    };

    return httpServices.post(url, data);
};

var turnOffLight = function() {
    var data = {
        device: "light",
        action: "off"
    };

    return httpServices.post(url, data);
};

var getLightStatus = function() {
    var data = {
        device: "light",
        action: "getStatus"
    };

    return httpServices.post(url, data);
};

module.exports = {
    getLightStatus: getLightStatus,
    turnOffLight: turnOffLight,
    turnOnLight: turnOnLight
};