// Exposes variables to interact with paypal
//paypal setup
var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'Aet-dK0J0USNh5dbBjafAcxSUiH5xGjNib6hFnDAoTSiC_DM9ghJoUrz0UBXTKFNUvmizlJbLtJNx8oR',
  'client_secret': process.env.Paypal_Secret
});

module.exports = paypal;
