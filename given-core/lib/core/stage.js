/**
 * Stage module.
 *
 * Provides a proxy mechanism to wrap stage objects and intercept step methods
 *
 * @module core/stage
 */

'use strict';

var log = require('../util/log');

function wrapStepMethod(scenario, obj, methodName, stage) {
  log("Wrapping method " + methodName);
  return function () {
    scenario.addStep(obj, methodName, Array.prototype.slice.call(arguments));
    return stage;
  };
}

/**
 * Creates a stage from a given object.
 *
 * @param scenario the scenario to add the stage to
 * @param obj the stage object
 */
module.exports = function stage(scenario, obj) {
  var s = Object.create(obj);
  var p;

  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (typeof(obj[p]) === 'function') {
        s[p] = wrapStepMethod(scenario, obj, p, s);
      }
    }
  }

  s.given = stepMethod('given');
  s.when = stepMethod('when');
  s.then = stepMethod('then');
  s.and = stepMethod('and');
  s.but = stepMethod('but');
  s.world = scenario.world;

  return s;

  function stepMethod(word) {
    return function () {
      scenario.addIntroWord(word);
      return s;
    };
  }
};