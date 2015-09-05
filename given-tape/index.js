var tape = require('tape');
var core = require('given-core');

var givenTape = Object.create(tape);
var setupFunction = function () {
};

givenTape.test = function test(name, cb) {
  tape.test(name, callback);

  var fileName = core.getFileName(test);

  function callback(t) {
    var scenario = core.startScenario(fileName, name);
    var enhanced = core.prepareTestObject(scenario, t);
    setupFunction(enhanced, scenario.world);
    cb(enhanced, scenario.world);
    enhanced.finished();
  }
};

givenTape.finished = function finished() {
  tape.test('givenjs report generation', function (t) {
    core.finished();
    t.end();
  });
};

givenTape.tag = function tag() {
  core.tag(Array.prototype.slice.call(arguments, 0));
};

givenTape.setup = function (fn) {
  setupFunction = fn;
};

module.exports = givenTape;
