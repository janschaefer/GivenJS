var tape = require('tape')
var t = require('given-tape')(tape)
var test = t.test

var GivenCustomer = require('../stages/givencustomer')
var WhenOrder = require('../stages/whenorder')
var ThenEmail = require('../stages/thenemail')
var ExtraStage = require('../stages/extrastage')

require('where.js')

t.tag('tape')

t.setup(function (s, world) {
  s.givenStage(new GivenCustomer(world))
  s.whenStage(new WhenOrder(world))
  s.thenStage(new ThenEmail(s, world))
})


test('givenjs can be used to write Given-When-Then scenarios using node-tap', function (_, world) {
  var extraStage = _.stage(new ExtraStage(world))

  _.given().a_customer()
    .and().a_book()

  _.when().the_customer_orders_a_book()

  _.then().an_email_is_sent_to_the_customer()

  extraStage
    .then().something_additional_happens()
})

test('Step methods can have parameters', function (_) {

  _.given().a_customer_with_name('John')
    .and().$_books_with_name(5, 'The Lord of the Rings')
})

where(function () {
  /***
   nbooks | name
   1      | One
   4      | Two
   6      | Three
   ***/
  t.test('Scenarios can be parameterized', function (_) {
    _.given().a_customer()
      .and().$_books_with_name(nbooks, name)
    _.when().the_customer_orders_a_book()
  })
}, {t: t})


t.enableGlobals()
test('Globals can be enabled', function () {

  given().a_customer()
    .and().a_book()

  when().the_customer_orders_a_book()
  then().an_email_is_sent_to_the_customer()

})

t.finished()
