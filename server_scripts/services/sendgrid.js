/**
 * Exposes variables to interact with sendgrid API
 */
"use strict";
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var helper = require('sendgrid').mail;
var _ = require('lodash');
var fs = require('fs');


function sendInvoice(from, toArray, subject, subs, pdfFile, cb) {
	var from_email = new helper.Email(from);
	var to_email = new helper.Email(toArray[0]);
	
	var subject = subject;
	var content = new helper.Content('text/html', ".");
	var mail = new helper.Mail(from_email, subject, to_email, content);
	_.forEach(subs, function(value, key) {
	  mail.personalizations[0].addSubstitution(new helper.Substitution(key, value));
	});
	_.each(toArray, function(value, i) {
		if (i !== 0) {
			mail.personalizations[0].addTo(new helper.Email(value));
		}
	});
	mail.setTemplateId('c88c5fe3-df82-4343-93b2-13b73ae681f7');

	var pdf = fs.readFileSync(pdfFile.path);

	var pdfBuffer = new Buffer(pdf)
	var base64encoded = pdfBuffer.toString('base64');

	mail.addAttachment({'content': base64encoded, 'filename': pdfFile.name});


	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON(),
	});

	sg.API(request, function(error, response) {
	  cb(error, response)
	});
};

function sendReceipt(from, toArray, subject, subs, cb) {
	var from_email = new helper.Email(from);
	var to_email = new helper.Email(toArray[0]);
	
	var subject = subject;
	var content = new helper.Content('text/html', ".");
	var mail = new helper.Mail(from_email, subject, to_email, content);
	_.forEach(subs, function(value, key) {
	  mail.personalizations[0].addSubstitution(new helper.Substitution(key, value));
	});
	_.each(toArray, function(value, i) {
		if (i !== 0) {
			mail.personalizations[0].addTo(new helper.Email(value));
		}
	});
	mail.setTemplateId('9ba84528-e8bb-419a-a72d-d69ea9818410');

	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON(),
	});

	sg.API(request, function(error, response) {
	  cb(error, response)
	});
};

function send(from, to, resetInfo, subject, templateId, cb) {
	var from_email = new helper.Email(from);
	var to_email = new helper.Email(to);
	var subject = subject;
	var content = new helper.Content('text/html', resetInfo);
	var mail = new helper.Mail(from_email, subject, to_email, content);
	mail.setTemplateId(templateId);
	var request = sg.emptyRequest({
	  method: 'POST',
	  path: '/v3/mail/send',
	  body: mail.toJSON(),
	});

	sg.API(request, function(error, response) {
	  cb(error, response)
	});
};

module.exports = {
	sendInvoice: sendInvoice,
	sendReceipt: sendReceipt,
	send: send
};
