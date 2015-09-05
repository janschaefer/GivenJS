var t = require('../../lib/given-tap.js')
var stages = require('../stages/stages');
require('where.js');

t.tag('foobar', 'shoebar');

t.setup( function (s, world) {
    s.givenStage( new stages.GivenCustomer(world) );
    s.whenStage( new stages.WhenOrder(world) );
    s.thenStage( new stages.ThenEmail(s, world) );
});


t.test('givenjs can be used to write Given-When-Then scenarios using node-tap', function(_, world) {
    var extraStage = _.stage( new stages.ExtraStage(world) );

    _.given().a_customer()
        .and().a_book();

    _.when().the_customer_orders_a_book();

    _.then().an_email_is_sent_to_the_customer();

    extraStage
        .then().something_additional_happens();
});

t.test('Step methods can have parameters', function(_) {

    _.given().a_customer_with_name("John")
        .and().$_books_with_name(5, 'The Lord of the Rings');
});

where(function(){
    /***
        nbooks | name
        1      | One
        4      | Two
        6      | Three
    ***/
    t.test("Scenarios can be parameterized", function(_) {
        _.given().a_customer()
            .and().$_books_with_name(nbooks, name);
        _.when().the_customer_orders_a_book();
    });
}, { t:t });
