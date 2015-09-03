'use strict';

/**
 * Renders a report model to a string
 */

var _ = require('lodash');
var AsciiTable = require('ascii-table');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function renderModelAsString( model ) {
    var result = '';

    function append( str ) {
       result += str + '\n';
    }

    append('Test Suite: '+ model.className);

    for ( var i = 0; i < model.scenarios.length; i++) {
        printScenario( model.scenarios[i], append );
    }

    return result;

    function printScenario( scenarioModel, append ) {
        append( ' ' );
        append( ' Scenario: '+scenarioModel.description );

        var scenarioCases = scenarioModel.scenarioCases;
        var nCases = scenarioModel.casesAsTable ? 1 : scenarioCases.length;
        for (var iCase = 0; iCase < nCases; iCase++) {
            append( ' ' );
            if (nCases > 1) {
                append("  Case "+(iCase+1)+":");
            }

            var scenarioCase = scenarioCases[iCase];
            for (var i = 0; i < scenarioCase.steps.length; i++) {
                printStep( scenarioCase.steps[i] );
            }
        }

        if (scenarioModel.casesAsTable) {
            printDataTable();
        }

        append( ' ' );

        function printStep( stepModel ) {
            var stepString = '';
            var firstWord = stepModel.words[0];
            var start = 0;
            var introWord = '      ';

            if (firstWord.isIntroWord) {
                start = 1;
                introWord += capitalizeFirstLetter(firstWord.value);
            }

            stepString += introWord.slice(-5) + ' ';

            for (var i = start; i < stepModel.words.length; i++) {
                var word = stepModel.words[i];
                if (scenarioModel.casesAsTable && 
                    word.argumentInfo &&
                    scenarioModel.derivedParameters.indexOf(word.argumentInfo.argumentName) !== -1) {
                    stepString += "<"+word.argumentInfo.argumentName+"> ";
                } else {
                    stepString += word.value + ' ';
                }
            }
            append('   '+ stepString);
        }

        function printDataTable() {
            var i;
            append( ' ' );
            append( '  Cases:');
            append( ' ' );

            var table = new AsciiTable("", { prefix: "  " });
            table
                .setBorder('|','-','.',"'")
                .setHeading( ["#"].concat(scenarioModel.derivedParameters).concat(['Status']) );

            _.forEach( scenarioModel.scenarioCases, function (aCase) {
                table.addRow( [aCase.caseNr].concat(aCase.derivedArguments).concat([aCase.statusString()]));
            });

            result += table.toString();
        }
   }
}





module.exports = renderModelAsString;
