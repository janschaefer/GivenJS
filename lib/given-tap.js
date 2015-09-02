var tap = require('tap');
var core  = require('./core/core.js');
var filename = require('./util/filename');

var givenTap = Object.create(tap);
var setupFunction = function() {};

givenTap.test = function test(name, cb) {
    var fileName = filename();

    tap.test(name, callback);

    function callback(t) {
        var scenario = core.startScenario(fileName, name);
        var enhanced = core.prepareTestObject(scenario, t);
        setupFunction(enhanced, scenario.world);
        cb(enhanced, scenario.world);
        enhanced.finished();
    }
};

givenTap.setup = function( fn ) {
    setupFunction = fn;
}

givenTap.tag = function tag() {
    core.tag( Array.prototype.slice.call(arguments,0) );
};

tap.tearDown( function() {
    core.finished();
});

module.exports = givenTap;
