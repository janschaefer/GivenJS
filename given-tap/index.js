/**
 * GivenJS for node-tap
 *
 * @module given-tap
 */

'use strict'

var core = require('given-core')

/**
 * Enhances the given tap object with GivenJS features
 *
 * @param tap an instances obtained by `require('tap')`
 * @returns an GivenJS-enhanced tap object
 */
module.exports = function givenTap (tap) {
  var givenTap = Object.create(tap)

  var setupFunction = function () {
  }

  givenTap.test = function test (name, cb) {
    tap.test(name, callback)

    var fileName = core.getFileName(test)

    function callback (t) {
      var scenario = core.startScenario(fileName, name)
      var enhanced = core.prepareTestObject(scenario, t)
      setupFunction(enhanced, scenario.world)
      cb(enhanced, scenario.world)
      enhanced.finished()
    }
  }

  givenTap.setup = function (fn) {
    setupFunction = fn
  }

  givenTap.tag = function tag () {
    core.tag(Array.prototype.slice.call(arguments, 0))
  }

  tap.tearDown(function () {
    core.finished()
  })

  /**
   * Provide global functions given(), when() and then()
   */
  givenTap.enableGlobals = function () {
    core.createGlobals()
  }

  return givenTap
}
