var tape = require('tape');
var core = require('givenjs-core');

var givenTape = Object.create(tape);
var setupFunction = function() {};

givenTape.test = function test(name, cb) {
    core.initTest(test);

    tape.test(name, callback);

    function callback(t) {
        var scenario = core.startScenario(fileName, name);
        var enhanced = core.prepareTestObject(scenario, t);
        setupFunction(enhanced, scenario.world);
        cb(enhanced, scenario.world);
        enhanced.finished();
    }
};

givenTape.finished = function finished() {
    tape.test('givenjs report generation', function(t) {
        core.finished();
        t.end();
    });
};

givenTape.tag = function tag() {
    core.tag( Array.prototype.slice.call(arguments,0) );
};

givenTape.setup = function( fn ) {
    setupFunction = fn;
};

module.exports = givenTape;
