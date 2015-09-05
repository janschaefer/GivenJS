'use strict';

function GivenCustomer(world) {
    this.a_customer = function() {
        console.log("Creating a customer");
        world.customer = { name: 'John Smith' };
    };

    this.a_customer_with_name = function( name ) {
        this.a_customer();
        world.customer.name = name;
    };

    this.$_books_with_name = function(nBooks, bookName) {
        world.book = { name: bookName };
    };

    this.a_book = function() {
        world.book = { name: 'Great Name' };
    };
}

function WhenOrder(world) {
    this.the_customer_orders_a_book = function(callback) {
        // simulate asynchronous callback
        setTimeout(function() {
            world.orderId = 1234;
            callback();
        }, 0);
    };
}

function ThenEmail(t, world) {
    this.an_email_is_sent_to_the_customer = function() {
        t.equal( world.customer.name, 'John Smith' );
        t.equal( world.book.name, 'Great Name' );
        t.equal( world.orderId, 1234, 'orderId is wrong');
    };
}

function ExtraStage( world ) {
    this.something_additional_happens = function() {}
}


module.exports = {
    GivenCustomer: GivenCustomer,
    WhenOrder: WhenOrder,
    ThenEmail: ThenEmail,
    ExtraStage: ExtraStage
}
