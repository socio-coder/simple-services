var fs = require('fs');
var request = require('sync-request');

var option = {
    consoleLog: {
        status: true
    },
    fileLog: {
        status: false,

    },
    httpLog: {
        status: false,
        host: "",
        port: ""
    }
}

var nodger = {

    configure: function(configuration) {
        if (configuration) {
            if (configuration.consoleLog) {
                if (configuration.consoleLog.status != null) {
                    option.consoleLog.status = configuration.consoleLog.status;
                } else {
                    throw new Error("Configuration consoleLog require status");
                }
            }
            if (configuration.fileLog) {
                if (configuration.fileLog.status != null) {
                    option.fileLog.status = configuration.fileLog.status;
                } else {
                    throw new Error("Configuration fileLog require status");
                }
                if (configuration.fileLog.path) {
                    option.fileLog.path = configuration.fileLog.path;
                } else {
                    throw new Error("Configuration fileLog require path");
                }
            }
            if (configuration.httpLog) {
                if (configuration.httpLog.status != null) {
                    option.httpLog.status = configuration.httpLog.status;
                } else {
                    throw new Error("Configuration httpLog require status");
                }
                if (configuration.httpLog.host) {
                    option.httpLog.host = configuration.httpLog.host;
                } else {
                    throw new Error("Configuration httpLog require host");
                }
                if (configuration.httpLog.port) {
                    option.httpLog.port = configuration.httpLog.port;
                } else {
                    throw new Error("Configuration httpLog require port");
                }
            }

        }
    },
    log: function(text) {

        // var date = getCurrentDate();

        // var logLine = date + " " + text;
        var logLine = text;

        if (option.consoleLog.status) {
            console.log(logLine);
        }
        if (option.fileLog.status) {
            fs.appendFileSync(option.fileLog.path, logLine + "\n");
        }
        if (option.httpLog.status) {
            var url = "http://" + option.httpLog.host + ":" + option.httpLog.port;
            try {
                var res = request('POST', url, {
                    body: logLine,
                    timeout: 3000
                });
                console.log(res.getBody('utf8'));
            } catch (e) {
                return { error: e }
            }
        }

    }


};
//getting the two digits representation of single digit string, eg. 2-->02 
var getTwoDigitsString = function(number) {
    number = number.toString();

    if (number.length < 2) {
        number = "0" + number;
    }

    return number;
};
// getting current date in Catalina's Format
var getCurrentDate = function() {
    var currentTimestamp = new Date();
    var date = getTwoDigitsString(currentTimestamp.getMonth() + 1) + "/" + getTwoDigitsString(currentTimestamp.getDate()) + "/" + getTwoDigitsString(currentTimestamp.getFullYear()) + " " + getTwoDigitsString(currentTimestamp.getHours()) + ":" + getTwoDigitsString(currentTimestamp.getMinutes()) + ":" + getTwoDigitsString(currentTimestamp.getSeconds());
    return date;
};

module.exports = nodger;