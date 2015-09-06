/*eslint spaced-comment:0 no-undef:0 */
'use strict'

var tape = require('tape')
var t = require('../')(tape)
var test = t.test

var GivenCustomer = require('./stages/givencustomer')
var WhenOrder = require('./stages/whenorder')
var ThenEmail = require('./stages/thenemail')
var ExtraStage = require('./stages/extrastage')

t.setup(function (s, world) {
  s.givenStage(new GivenCustomer(world))
  s.whenStage(new WhenOrder(world))
  s.thenStage(new ThenEmail(s, world))
})

test('givenjs can be used to write Given-When-Then scenarios using tape',
  function (_, world) {
    var extraStage = _.stage(new ExtraStage(world))

    _.given().a_customer()
      .and().a_book()

    _.when().the_customer_orders_a_book()
    _.then().an_email_is_sent_to_the_customer()

    extraStage
      .then().something_additional_happens()
  })

test('This is another test', function (s) {

})

t.finished()
