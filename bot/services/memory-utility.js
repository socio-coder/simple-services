var updateLTMem = function(LTMem, data) {
    console.log("data>>>>", data);
    var MAX_SIZE = 10;
    if (!LTMem) LTMem = [];
    var memChunk = {
        timestamp: new Date().getTime(),
        subject: data.subject,
        content: data.content
    };
    var i = -1;
    LTMem.forEach(function(element, index) {
        if (element.subject === memChunk.subject) {
            if (element.content === memChunk.content)
                i = index
        }
    }, this);
    if (i != -1) LTMem.splice(i, 1);
    if (LTMem.length + 1 > MAX_SIZE) LTMem.shift();
    LTMem.push(memChunk);
    return LTMem;
};

var updateSTMem = function(data) {
    var memChunk = {
        timestamp: new Date().getTime(),
        subject: data.subject,
        content: data.content
    };
    return memChunk;
};

var checkSTMemValidity = function(STMem) {
    var validity = 1000 * 60 * 5;
    if (STMem.timestamp < (new Date().getTime() - validity)) return "INVALID";
    else return "VALID";
};

var resetSTMem = function(STMem) {
    return null;
};

var isFreshConversation = function(STMem) {
    if (!STMem && STMem == null) return true;
    else return false;
}

var rememberInfoBySubject = function(LTMem, subject) {
    if (!LTMem) return [];
    var result = [];
    LTMemTemp = LTMem.slice();
    console.log(">>>>>>>>>>", LTMem);
    LTMemTemp.reverse();
    LTMemTemp.forEach(function(element) {
        if (element.subject == subject) result.push(element.content);
    }, this);
    return result.slice(0, 3);
};

module.exports = {
    updateLTMem: updateLTMem,
    rememberInfoBySubject: rememberInfoBySubject,
    updateSTMem: updateSTMem,
    checkSTMemValidity: checkSTMemValidity,
    resetSTMem: resetSTMem,
    isFreshConversation: isFreshConversation


};