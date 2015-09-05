/**
 * Core module.
 * @module core/core
 */
'use strict';

var log = require('../util/log');
var getConfig = require('../util/config');
var filename = require('../util/filename');
var Model = require('../model/model');
var renderModelAsString = require('../report/consolereport');
var analyseModel = require('./paramanalyser');
var Scenario = require('./scenario');

/**
 * Maps file names to Models
 */
var models = {};
var fileTags = [];
var currentModel = null;
var currentTestState = null;

module.exports.tag = function tag(tags) {
  if (!currentTestState) {
    fileTags = fileTags.concat(tags);
  } else {
    currentTestState.scenarioModel.addTags(tags);
  }
};

/**
 * Returns the file name where the given function is defined
 *
 * @param testFn the test function to get the file name of
 * @returns {string} the file name
 */
module.exports.getFileName = function getFileName(testFn) {
  var fileName = filename(testFn);
  console.assert(fileName, "Could not determine file name");
  return fileName;
};

/**
 * Starts a scenario.
 *
 * @param {string} name the name of the scenario
 */
module.exports.startScenario = function startScenario(fileName, name) {
  currentTestState = {};
  currentTestState.scenarioModel = getModel(fileName).getScenarioModel(name);
  currentTestState.scenarioModel.addTags(fileTags);
  var scenario = new Scenario(currentTestState.scenarioModel);
  log("Starting scenario " + name + " in test file '" + fileName + "'");
  return scenario;
}
;

module.exports.finished = function finished() {
  var model = currentModel;
  if (model) {
    model.addMissingTags();
    analyseModel(model);
    log.info(renderModelAsString(model));
    model.write(getConfig().reportDir);
    fileTags = [];
  }
};

module.exports.createGlobals = function createGlobals() {
  GLOBAL.given = function given() {
    return currentTestState.testObject.given();
  };
  GLOBAL.when = function when() {
    return currentTestState.testObject.when();
  };
  GLOBAL.then = function then() {
    return currentTestState.testObject.then();
  };
};

function getModel(name) {
  var model = models[name];
  if (model) return model;

  model = Model.newModel(name);
  currentModel = model;
  models[name] = model;
  return model;
}

function stageMethod(scenario, introWord) {
  return function () {
    scenario.addIntroWord(introWord);
    return this['_stage' + introWord];
  };
}

function addStageMethod(scenario, name) {
  return function (stageObj) {
    var stage = scenario.addStage(stageObj);
    this['_stage' + name] = stage;
    return stage;
  };
}

module.exports.prepareTestObject = function prepareTestObject(scenario, t) {
  var s = Object.create(t);

  s.given = stageMethod(scenario, 'given');
  s.when = stageMethod(scenario, 'when');
  s.then = stageMethod(scenario, 'then');

  s.givenStage = addStageMethod(scenario, 'given');
  s.whenStage = addStageMethod(scenario, 'when');
  s.thenStage = addStageMethod(scenario, 'then');

  s.stage = function (stage) {
    return scenario.addStage(stage);
  };

  s.finished = function () {
    if (scenario && !scenario.isFinished) {
      scenario.finish(function () {
        t.end();
      });
    }
  };

  currentTestState.testObject = s;

  return s;
};
