'use strict';

/**
 * Represents the runtime model a single test file
 */

var _ = require('lodash');

var log = require('../util/log');
var writeModel = require('./writer');


function removeUnderlines(value) {
    if (!value) return '';

    return value.replace(/_/g,' ');
}

function TagModel( name ) {
    this.type = name;
    this.value = undefined;
    this.description = ""
    this.prependType = true;
    this.color = "blue";
}

function WordModel( value, isIntroWord ) {
    this.value = "" + value;

    if (isIntroWord) {
        this.isIntroWord = true;
    }

    log('New WordModel: '+value+", "+isIntroWord);
}

WordModel.prototype.addArgumentInfo = function addArgumentInfo( paramName, value) {
    this.argumentInfo = {
        parameterName: paramName,
        argumentName: paramName,
        formattedValue: value
    };
};

WordModel.newArg = function( paramName, argValue ) {
    var wordModel = new WordModel( argValue, false );
    wordModel.addArgumentInfo( paramName, argValue );
    return wordModel;
}

function StepModel( introWord, value, paramNames, args, durationInNanos) {
    this.value = value;
    this.words = [];
    this.status = "PASSED";
    this.durationInNanos = durationInNanos;

    if (introWord) {
        this.words.push( new WordModel( removeUnderlines(introWord), true ));
    }

    splitValueToWords( this.words, value, paramNames, args );
}

function splitValueToWords( words, value, paramNames, args ) {
    var valueWords = value.split('_');
    var wordString = '';
    var word;
    var wordModel;
    var argIndex = 0;
    var i;

    for (i = 0; i < valueWords.length; i++) {
        word = valueWords[i];
        if (word === '$') {
            if (wordString !== '') {
                words.push( new WordModel( wordString, false ) );
                wordString = '';
            }
            words.push(WordModel.newArg( paramNames[argIndex], args[argIndex]));
            argIndex++;
        } else {
            if (wordString !== '') {
                wordString += ' ';
            }
            wordString += word;
        }
    }

    if (wordString !== '') {
        words.push( new WordModel( wordString, false ) );
    }

    for (i = argIndex; i < args.length; i++ ) {
        words.push(WordModel.newArg( paramNames[argIndex], args[argIndex]));
    }
}

function ScenarioCaseModel(nr) {
    this.caseNr = nr;
    this.steps = [];
    this.success = true;
    this.errorMessage;
    this.durationInNanos = 82324429;
}

ScenarioCaseModel.prototype.addStep = function addStep( introWord, value, paramNames, args, durationInMs ) {
    log("addStep: "+introWord+","+value);
    var step = new StepModel( introWord, value, paramNames, args, durationInMs * 1000000);
    this.steps.push(step);
    return step;
};

ScenarioCaseModel.prototype.statusString = function statusString() {
    return this.success ? 'Success' : 'Error: '+ errorMessage;
};

function ScenarioModel(className, methodName) {
    this.className = className;
    this.testMethodName = methodName;
    this.description = removeUnderlines(methodName);
    this.tagIds = ['JS'];
    this.pending = false;
    this.explicitParameters = [];
    this.derivedParameters = [];
    this.casesAsTable = false;
    this.scenarioCases = [];
    this.durationInNanos = -1;
    this.executionStatus = "SUCCESS";
    this.addScenarioCase();
}

ScenarioModel.prototype.setDerivedParameters = function( derivedParameters ) {
    this.derivedParameters = derivedParameters;
}

ScenarioModel.prototype.finished = function finished( durationInMs ) {
    this.durationInNanos = durationInMs * 1000000;
};

ScenarioModel.prototype.addScenarioCase = function addScenarioCase() {
    var scenarioCase = new ScenarioCaseModel(this.scenarioCases.length + 1);
    this.scenarioCases.push( scenarioCase );
};

ScenarioModel.prototype.currentScenarioCase = function() {
    return this.scenarioCases[ this.scenarioCases.length - 1 ];
}

ScenarioModel.prototype.addStep = function addStep( introWord, name, paramNames, args, durationInMs ) {
    return this.currentScenarioCase().addStep( introWord, name, paramNames, args, durationInMs );
};

ScenarioModel.prototype.addTags = function addTags( tags ) {
    this.tagIds = this.tagIds.concat( tags );
}

function Model(name) {

    this.className = name;
    this.scenarios = [];
    this.tagMap = {};
    this.tagMap['JS'] = new TagModel('JS');

    log("Creating new model "+this.className);
}

Model.prototype.write = function write() {
    writeModel( this );
};

Model.prototype.getLastScenarioModel = function() {
    return this.scenarios[ this.scenarios.length -1 ];
};

Model.prototype.getScenarioModel = function getScenarioModel(methodName) {
    var lastScenario = this.getLastScenarioModel();
    if (lastScenario && lastScenario.testMethodName === methodName ) {
        lastScenario.addScenarioCase();
        return lastScenario;
    } else {
        var scenario = new ScenarioModel(this.className, methodName);
        this.scenarios.push(scenario);
        return scenario;
    }
};

Model.prototype.addMissingTags = function addMissingTags() {
    var self = this;
    log.debug("Add missing tags to model");
    _.forEach( this.scenarios, function( scenario ) {
        _.forEach( scenario.tagIds, function( tagId ) {
            if (!self.tagMap[tagId]) {
                self.tagMap[tagId] = new TagModel(tagId);
            }
        });
    });
};

module.exports = {
    newModel: function(name) {
        return new Model(name);
    }
};
