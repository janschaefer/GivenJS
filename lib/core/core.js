'use strict';

var log = require('../util/log');
var config = require('../util/config');
var Model = require('../model/model');
var renderModelAsString = require('../report/consolereport');
var analyseModel = require('./paramanalyser');
var Scenario = require('./scenario');

/**
 * Maps filenames to Models
 */
var models = {};
var currentModel = null;
var currentScenario = null;
var currentTags = [];

function getModel(name) {
    var model = models[name];
    if (model) return model;

    log("Creating new model for file "+name);
    model = Model.newModel(name);
    currentModel = model;
    models[name] = model;
    return model;
}

function tag( tags ) {
    currentTags = currentTags.concat( tags );
}

function startScenario( fileName, name ) {
    var scenarioModel = getModel(fileName).getScenarioModel( name );
    scenarioModel.addTags( currentTags );
    currentScenario = new Scenario( scenarioModel );
    log("Starting scenario " + name);
    return currentScenario;
}

function finished() {
    if (currentModel) {
        currentModel.addMissingTags();
        analyseModel( currentModel );
        log.info( renderModelAsString( currentModel ));
        currentModel.write();
        currentTags = [];
    }
}

function stageMethod( scenario, introWord ) {
    return function() {
        scenario.addIntroWord( introWord );
        return this['_stage'+introWord];
    }
}

function addStageMethod( scenario, name ) {
    return function( stageObj ) {
        var stage = scenario.addStage( stageObj );
        this['_stage'+name] = stage;
        return stage;
    }
}

function prepareTestObject( scenario, t ) {
    var s = Object.create(t);

    s.given = stageMethod( scenario, 'given');
    s.when = stageMethod( scenario, 'when');
    s.then = stageMethod( scenario, 'then');

    s.givenStage = addStageMethod( scenario, 'given' );
    s.whenStage = addStageMethod( scenario, 'when' );
    s.thenStage = addStageMethod( scenario, 'then' );

    s.stage = function( stage ) {
        return scenario.addStage(stage);
    };

    s.finished = function() {
        if (scenario && !scenario.isFinished) {
            scenario.finish( function() {
                t.end();
            });
        }
    };

    return s;
}

module.exports = {
    startScenario: startScenario,
    finished: finished,
    prepareTestObject: prepareTestObject,
    tag: tag,
};
