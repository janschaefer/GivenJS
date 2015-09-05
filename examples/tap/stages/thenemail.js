'use strict';

module.exports = function ThenEmail(t, world) {
  this.an_email_is_sent_to_the_customer = function () {
    t.equal(world.customer.name, 'John Smith');
    t.equal(world.book.name, 'Great Name');
    t.equal(world.orderId, 1234, 'orderId is wrong');
  };
};

