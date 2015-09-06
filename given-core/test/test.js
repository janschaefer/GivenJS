var t = require('tape')
var core = require('../index')

t.test('some tape test', function (t) {
  core.startScenario('test file name', 'scenario name')
  t.equal('x', 'x')
  t.end()
})
