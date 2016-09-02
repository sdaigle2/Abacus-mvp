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
	mail.setTemplateId('ab18bc4d-d178-4cee-866c-b7ef11c486b8');

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
	send: send
};
