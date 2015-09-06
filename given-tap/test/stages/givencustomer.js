'use strict'

module.exports = function GivenCustomer (world) {
  this.a_customer = function () {
    console.log('Creating a customer')
    world.customer = {name: 'John Smith'}
  }

  this.a_customer_with_name = function (name) {
    this.a_customer()
    world.customer.name = name
  }

  this.$_books_with_name = function (nBooks, bookName) {
    world.book = {name: bookName}
  }

  this.a_book = function () {
    world.book = {name: 'Great Name'}
  }
}
