'use strict';

var log = require('../util/log');
var getParameterNames = require('../util/getparamnames');
var stage = require('./stage');

function hasCallbackParameter( params ) {
    var lastParam = params[ params.length -1 ];
    return lastParam === 'callback' || lastParam === 'cb';
}

function Step( scenario, stage, introWord, methodName, args ) {
    this.scenario = scenario;
    this.stage = stage;
    this.introWord = introWord;
    this.methodName = methodName;
    this.args = args;
}

Step.prototype.execute = function execute(cb) {
    log("Executing "+this.methodName);
    var self = this;

    var fn = this.stage[this.methodName];

    this.parameterNames = getParameterNames(fn);

    var hasCallbackParam = hasCallbackParameter(this.parameterNames);

    var start = new Date().getTime();

    var extendedArgs = this.args.concat([callback]);
    var result = fn.apply( this.stage, extendedArgs );

    if (!hasCallbackParam) {
        callback();
        return result || this.stage;
    }

    function callback() {
        self.durationInMs = new Date().getTime() - start;
        cb();
    }
}

function Scenario( scenarioModel ) {
    this.scenarioModel = scenarioModel;
    this.stages = [];
    this.steps = [];
    this.world = {};
}

Scenario.prototype.addStage = function addStage( stageObj ) {
    var enhancedStage = stage( this, stageObj );
    this.stages.push( enhancedStage );
    return enhancedStage;
};

Scenario.prototype.addIntroWord = function addIntroWord( introWord ) {
    this.introWord = introWord;
};

Scenario.prototype.addStep = function addStep( stage, methodName, args ) {
    this.steps.push( new Step( this, stage, this.introWord, methodName, args ) );
};

Scenario.prototype.execute = function execute( cb ) {
    var started = new Date().getTime();
    this.executeStep(0, started, cb);
};

Scenario.prototype.executeStep = function executeStep(i, started, cb) {
    var self = this;
    if (i >= this.steps.length) {
        self.scenarioModel.finished( new Date().getTime() - started );
        return cb();
    }

    var step = this.steps[i];

    step.execute( function() {
        self.scenarioModel.addStep( step.introWord, step.methodName, step.parameterNames, step.args, step.durationInMs );
        self.executeStep(i+1, started, cb);
    });
};

Scenario.prototype.finish = function finish( cb ) {
    this.execute( cb );
    this.isFinished = true;
};

module.exports = Scenario;
