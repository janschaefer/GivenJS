var t = require('../../lib/given-tape.js')
var stages = require('../stages/stages');

t.setup( function (s, world) {
    s.givenStage( new stages.GivenCustomer(world) );
    s.whenStage( new stages.WhenOrder(world) );
    s.thenStage( new stages.ThenEmail(s, world) );
});

t.test('givenjs can be used to write Given-When-Then scenarios using tape',
       function(_, world) {

    var extraStage = _.stage( new stages.ExtraStage(world) );

    _.given().a_customer()
        .and().a_book();

    _.when().the_customer_orders_a_book();
    _.then().an_email_is_sent_to_the_customer();

    extraStage
        .then().something_additional_happens();
});

t.test('This is another test', function(s) {

});

t.finished();
