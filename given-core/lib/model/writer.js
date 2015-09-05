/**
 *
 * @module model/writer
 */
'use strict';

var fs = require('fs');
var log = require('../util/log');

/**
 * Writes the given suite model to the configured report directory
 *
 * @param {SuiteModel} model
 */
module.exports = function writeModel(model, targetDir) {
  var fileName = targetDir + "/" + model.className + ".json";
  var content = JSON.stringify(model, null, 2);

  if (!fs.existsSync(targetDir)) {
    log("Creating directory " + targetDir);
    fs.mkdirSync(targetDir);
  }

  fs.writeFileSync(fileName, content);
  log.info("Written " + model.className + " to file " + fileName);

};