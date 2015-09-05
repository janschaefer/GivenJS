/**
 * Used for analysing scenarios to find out which step arguments are actual
 * scenario parameters to be able to create data tables.
 *
 * @module core/paramanalyser
 */

'use strict';

var log = require('../util/log');
var _ = require('lodash');


/**
 * Analyses the given model and tries to derive scenario parameters
 *
 * @param {ReportModel} model the model to analyse
 */
module.exports = function analyseModel(model) {
  for (var i = 0; i < model.scenarios.length; i++) {
    analyseScenario(model.scenarios[i]);
  }
};

function withoutNull(array) {
  return _.filter(array, function (x) {
    return x !== null;
  });
}

function analyseScenario(scenarioModel) {
  if (scenarioModel.scenarioCases.length === 1) {
    return;
  }

  var parameters = [];
  var i, j;

  for (i = 0; i < scenarioModel.scenarioCases.length; i++) {
    log.debug("Find parameters for case " + i);
    parameters.push(findParameters(scenarioModel.scenarioCases[i]));
  }

  log.debug("Parameters: " + JSON.stringify(parameters));

  var paramCount = parameters[0].length;

  for (i = 1; i < parameters.length; i++) {
    if (paramCount !== parameters[i].length) {
      log.debug('Number of parameters differ in case ' + i + '. Expected ' + paramCount + ', but was ' + parameters[i].length);
      return;
    }
  }

  var commonParams = parameters[0];
  var same;
  for (i = 0; i < paramCount; i++) {
    log.debug("Checking parameter " + i);
    same = true;
    for (j = 1; j < parameters.length; j++) {
      log.debug("Param " + i + " case " + j + ": " + parameters[j][i].value);
      if (commonParams[i].value !== parameters[j][i].value) {
        same = false;
        break;
      }
    }
    if (same) {
      log.debug("Parameter " + i + " is all the same");
      commonParams[i] = null;
    } else {
      log.debug("Parameter " + i + " is different!");
    }
  }

  log.debug("CommonParams " + JSON.stringify(commonParams));

  var differentParams = withoutNull(commonParams);
  log.debug("DifferentParams " + JSON.stringify(differentParams));
  var names = _.map(differentParams, function (word) {
    return word.argumentInfo.argumentName;
  });

  log.debug('Found derived parameters: ' + names);
  scenarioModel.setDerivedParameters(names);

  for (j = 0; j < parameters.length; j++) {
    var args = [];
    for (i = 0; i < commonParams.length; i++) {
      if (commonParams[i] !== null) {
        args.push(parameters[j][i].value);
      }
    }
    scenarioModel.scenarioCases[j].derivedArguments = args;
  }

  scenarioModel.casesAsTable = true;
}


function findParameters(scenarioCase) {
  var parameters = [];
  for (var i = 0; i < scenarioCase.steps.length; i++) {
    findParametersInStep(scenarioCase.steps[i], parameters);
  }
  return parameters;
}

function findParametersInStep(step, parameters) {
  _.forEach(step.words, function (word) {
    if (word.argumentInfo) {
      parameters.push(word);
    }
  });
}

