'use strict';

var fs = require('fs');
var log = require('../util/log');
var config = require('../util/config');

function writeModel( model ) {
    var reportDir = config.reportDir;

    var fileName = reportDir+"/"+model.className + ".json";
    var content = JSON.stringify(model, null, 2);

    if (!fs.existsSync(reportDir)) {
        log("Creating directory "+reportDir);
        fs.mkdirSync(reportDir);
    }

   fs.writeFileSync(fileName, content);
   log.info("Written " + model.className + " to file "+ fileName);

 }

module.exports = writeModel;
