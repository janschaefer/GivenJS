'use strict'

/**
 * @module given-tape
 */

var core = require('given-core')

/**
 * Wraps the given tape instances, which should be obtained by `require('tape')`
 *
 * @param tape an instance of tape
 */
module.exports = function givenTape (tape) {
  var givenTape = Object.create(tape)

  var setupFunction = function () {
  }

  givenTape.test = function test (name, cb) {
    tape.test(name, callback)

    var fileName = core.getFileName(test)

    function callback (t) {
      var scenario = core.startScenario(fileName, name)
      var enhanced = core.prepareTestObject(scenario, t)
      setupFunction(enhanced, scenario.world)
      cb(enhanced, scenario.world)
      enhanced.finished()
    }
  }

  givenTape.finished = function finished () {
    tape.test('givenjs report generation', function (t) {
      core.finished()
      t.end()
    })
  }

  givenTape.tag = function tag () {
    core.tag(Array.prototype.slice.call(arguments, 0))
  }

  givenTape.setup = function (fn) {
    setupFunction = fn
  }

  /**
   * Provide global functions given(), when() and then()
   */
  givenTape.enableGlobals = function () {
    core.createGlobals()
  }

  return givenTape
}
