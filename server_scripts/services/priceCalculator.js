/**
 * Calculates total price for orders and wheelchairs
 * Mostly pulls its functionality from generatePDF/generateHTML/handlebar_helpers.js
 */

const helpers = require('./generatePDF/generateHTML/handlebar_helpers');

/**
 * Given an order, returns total for the order
 * Includes subtotal, shipping, tax, and discounts
 * Takes all wheelchairs in the order into account
 */
exports.getOrderTotal = order => {
	return Number(helpers.getTotalPrice.apply(order));
};


/**
 * Given an order, returns total discount amount for the order
 */
exports.getTotalDiscount = order => {
	return Number(helpers.getTotalDiscount.apply(order));
};

/**
 * Given an order, returns total subtotal amount for the order
 */
exports.getTotalSubtotal = order => {
	return Number(helpers.getTotalSubtotal.apply(order));
};

/**
 * Given an order, returns total shipping amount for the order
 */
exports.getTotalShipping = order => {
	return Number(helpers.getTotalShipping.apply(order));
};

/**
 * Given an order, returns total tax amount for the order
 */
exports.getTotalTax = order => {
	return Number(helpers.getTotalTax.apply(order));
};

/**
 * Given a input subtotal (w/o shipping fee), returns the tax fee for that price
 */
exports.getTaxCost = total => {
	return Number(helpers.getTaxCost(total));
};

/**
 * Given an order, returns total grant amount for the order
 */
exports.getTotalGrantAmount = order => {
	return Number(helpers.getTotalGrantAmount.apply(order));
};

/**
 * Given a wheelchair, will return the total price of that wheelchair
 * Takes into account the subtotal, shipping, & tax fees
 */
exports.getChairTotal = chair => {
	return Number(helpers.getChairPrice(chair));
};
