/**
 * Calculates total price for orders and wheelchairs
 * Mostly pulls its functionality from generateInvoicePDF/generateInvoiceHTML/handlebar_helpers.js
 */

const helpers = require('./generateInvoicePDF/generateInvoiceHTML/handlebar_helpers');

/**
 * Given an order, returns total for the order
 * Includes subtotal, shipping, tax, and discounts
 * Takes all wheelchairs in the order into account
 */
exports.getOrderTotal = order => {
	return Number(helpers.getTotalPrice.apply(order));
};

/**
 * Given a wheelchair, will return the total price of that wheelchair
 * Takes into account the subtotal, shipping, & tax fees
 */
exports.getChairTotal = chair => {
	return Number(helpers.getChairPrice(chair));
};