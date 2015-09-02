'use strict';

var path = require('path');

function getFileName() {
    var oldPrepareStackTrace = Error.prepareStackTrace;

    Error.prepareStackTrace = function (error, structuredStackTrace) {
        return structuredStackTrace;
    };

    var err = new Error();
    var stack = err.stack;
    var result;
    for (var i = 0; i < stack.length; i++) {
        var absoluteName = stack[i].getFileName();
        var name = path.basename(absoluteName, path.extname(absoluteName));
        if (name === 'module') {
            break;
        }
        result = name;
    }
    Error.prepareStackTrace = oldPrepareStackTrace;
    return result;
}

module.exports = getFileName;
