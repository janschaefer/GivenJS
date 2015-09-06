'use strict';

module.exports = function WhenOrder(world) {
  this.the_customer_orders_a_book = function (callback) {
    // simulate asynchronous callback
    setTimeout(function () {
      world.orderId = 1234;
      callback();
    }, 0);
  };
};
