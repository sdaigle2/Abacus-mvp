/**
 * Created by sourabhdesai on 5/6/16.
 *
 * Tests to check that you can increment the ordernumber sequentially
 */

const _ = require('lodash');

const orderNumber = require('../../../../server_scripts/services/orderNumber');

const NUM_INCREMENTS = 10;

describe('Tests that orderNumber service can be initialized and incremented', () => {
  it('Should resolve the orderNumber initPromise', done => {
    orderNumber.initPromise
      .then(orderNumDoc => {
        done()
      })
      .catch(done);
  });

  it(`Should be able to sequentially increment the order number ${NUM_INCREMENTS} times`, function (done) {
    done = _.once(done);
    this.timeout(20e3); // test will timeout only after 20 seconds

    // Make a chain of promises that will increment the orderNumber and do intermediary checks to see that increments are sequential
    var incrementChain = orderNumber.increment();
    _.times(NUM_INCREMENTS, () => {
      incrementChain = incrementChain
        .then(orderNum => {
          return orderNumber.increment()
            .then(nextOrderNum => {
              if (nextOrderNum !== (orderNum + 1)) {
                throw new Error(`Order Number Incrementing wasnt sequential: ${orderNum} -> ${nextOrderNum}`);
              }

              return nextOrderNum;
            });
        });
    });

    incrementChain
      .then(() => done())
      .catch(done);
  });

});
