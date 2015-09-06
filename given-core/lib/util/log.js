'use strict'

var levels = {
  OFF: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4
}

var level = levels.INFO

function log (msg) {
  log.debug(msg)
}

function logMethod (name) {
  return function (msg) {
    if (level >= levels[name]) {
      console.log('[' + name + '] ' + msg)
    }
  }
}

log.error = logMethod('ERROR')
log.warn = logMethod('WARN')
log.info = logMethod('INFO')
log.debug = logMethod('DEBUG')

log.setLogLevel = function (levelName) {
  var upperCase = levelName.toUpperCase()
  if (levels[upperCase]) {
    level = levels[upperCase]
    log.debug('Set debug level to ' + upperCase)
  } else {
    log.error('Unknown debug level ' + levelName)
  }
}

module.exports = log
