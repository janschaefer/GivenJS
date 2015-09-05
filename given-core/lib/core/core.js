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
var currentModel = null;
var currentScenario = null;
var currentTags = [];

module.exports.tag = function tag(tags) {
  currentTags = currentTags.concat(tags);
};

/**
 * Returns the file name where the given function is defined
 *
 * @param testFn the test function to get the file name of
 * @returns {string} the file name
 */
module.exports.getFileName = function getFileName(testFn) {
  return filename(testFn);
};

/**
 * Starts a scenario.
 *
 * @param {string} name the name of the scenario
 */
module.exports.startScenario = function startScenario(fileName, name) {
  var scenarioModel = getModel(fileName).getScenarioModel(name);
  scenarioModel.addTags(currentTags);
  currentScenario = new Scenario(scenarioModel);
  log("Starting scenario " + name + " in test file '" + fileName + "'");
  return currentScenario;
};

module.exports.finished = function finished() {
  if (currentModel) {
    currentModel.addMissingTags();
    analyseModel(currentModel);
    log.info(renderModelAsString(currentModel));
    currentModel.write(getConfig().reportDir);
    currentTags = [];
  }
};

function getModel(name) {
  var model = models[name];
  if (model) return model;

  log("Creating new model for file " + name);
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

  return s;
};
