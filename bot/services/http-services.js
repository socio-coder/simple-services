var syncRequest = require('sync-request');


function get(url) {
    var res = syncRequest('GET', url);
    return res.getBody('utf8');
};

function post(url, data) {
    var res = syncRequest('POST', url, {
        json: data
    });
    return res.getBody('utf8');
}

module.exports = {
    get: get,
    post: post
};