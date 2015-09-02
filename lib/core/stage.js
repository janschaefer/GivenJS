'use strict';

var log = require('../util/log');

function wrapStepMethod( scenario, obj, methodName, stage ) {
    log("Wrapping method "+methodName);
    return function() {
        scenario.addStep( obj, methodName, Array.prototype.slice.call(arguments) );
        return stage;
    };
}

/**
 * Creates a stage from a given object.
 */
function stage( scenario, obj ) {
    var stage = Object.create(obj);
    var p;

    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (typeof(obj[p]) === 'function') {
                stage[p] = wrapStepMethod( scenario, obj, p, stage);
            }
        }
    }

    stage.given = stepMethod('given');
    stage.when = stepMethod('when');
    stage.then = stepMethod('then');
    stage.and = stepMethod('and');
    stage.but = stepMethod('but');
    stage.world = scenario.world;

    return stage;

    function stepMethod( word ) {
        return function() {
            scenario.addIntroWord(word);
            return stage;
        };
    };
}

module.exports = stage;
