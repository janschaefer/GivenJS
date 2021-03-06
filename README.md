# GivenJS (PROTOTYPE)
Developer-friendly behavior-driven development for Javascript.

This is actually an implementation of [JGiven](http://jgiven.org) in Javascript. The JSON files produced by GivenJS are identical to those of JGiven. This allows you to use JGiven and GivenJS in the same project and create a combined report.

GivenJS is currently in a prototype status. It will also change a lot and should not be used in a real project, yet.

## Example

```
// require tap or tape
var tap = require('tap')

// enable GivenJS features by applying to the tap object
var t = require('given-tap')(tap)

// import stage implementations
var GivenCustomer = require('./stages/givencustomer')
var WhenOrder = require('./stages/whenorder')
var ThenEmail = require('./stages/thenemail')

// setup stages
t.setup( function (t, world) {
    t.givenStage( new GivenCustomer(world) )
    t.whenStage( new WhenOrder(world) )
    t.thenStage( new ThenEmail(t, world) )
})

// write a scenario
t.test('givenjs can be used with node-tap', function(_) {

    _.given().a_customer()
        .and().a_book()

    _.when().the_customer_orders_a_book()
    _.then().an_email_is_sent_to_the_customer()

})

```

## Supported test frameworks

* tap (`given-tap`)
* tape (`given-tape`)

### Missing test frameworks

* jasmine
* mocha
* ...

## Parameterized Scenarios

Parameterized scenarios are supported, for example, by using the `where.js` library:

```
where(function(){
    /***
        nbooks | name
        1      | One
        4      | Two
        6      | Three
    ***/
    t.test("Scenarios can be parameterized", function(_) {

        _.given().a_customer()
            .and().$_books_with_name(nbooks, name)
        _.when().the_customer_orders_book(name)
        _.then().the_book_will_be_shipped()

    });
}, { t:t })
```

This will result in the following report:

```
 Scenario: Scenarios can be parameterized

   Given a customer
     And <nBooks> books with name <bookName>
    When the customer orders a book
    Then the book will be shipped

  Cases:
  .---------------------------------.
  | # | nBooks | bookName | Status  |
  |---|--------|----------|---------|
  | 1 | 1      | One      | Success |
  | 2 | 4      | Two      | Success |
  | 3 | 6      | Three    | Success |
  '---------------------------------'
```

## Configuration

GivenJS can be configured by providing a file named `givenjs.json` with the following options:
```
{
    "reportDir": "givenjs-report",
    "logLevel": "info"
}
```

## Generate HTML Report

GivenJS generates a JSON report file for each test file. You can generate an HTML report from these JSON files by using the `given-html-report` as follows:


```
npm install -g given-html-report
```

```
given-html-report givenjs-report/*.json -t givenjs-html-report
```

The resulting report is identical to the one from [JGiven](http://jgiven.org/jgiven-report/html5/) (it uses the same sources).


## Missing Features compared to JGiven

* SHOWSTOPPER: Correct Error Handling
* Life-Cycle Methods of Stages
* Parameter formatting
* Pending steps
* Tags (partially)
* Measure time
* Attachments
* ...

## Differences to JGiven

### World Object
As Javascript is a dynamic language, the state injection mechanism of JGiven is not needed.
GivenJS just uses a single world object that is shared between the stages.

### Execution
The steps of a scenario are not directly executed in GivenJS. Instead, they are first all collected and then executed afterwards.
This means that when executing a GivenJS scenario in the debugger, it looks like every step is just skipped.
The reason for this execution model is that steps can possibly be executed asynchronously. To not clutter the scenario with callbacks,
GivenJS handles the callbacks internally, so that the callbacks only have to appear in the step implementations.

