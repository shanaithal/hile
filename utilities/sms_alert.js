var config = require('../config');
var twilio = require('twilio');
var twilioClient = new twilio.RestClient(config.twilio.account_sid, config.twilio.auth_token);
var User = require('../db/models/user');

var SMSClient = function () {

	return Object.create(SMSClient.prototype);
}

SMSClient.prototype.triggerAlert = function (buzz) {

	//config.smsAlertNumbers.forEach(function (element, index) {
	User.findById(buzz.product_owner_id, function (err, user) {
		if (err) {

			console.log(err);
		} else {
			twilioClient.sms.messages.create({

				to: user.contact,
				from: config.twilio.from_number,
				body: smsBody
			}, function (err, message) {

				if (err) {

					console.log('Could not send SMS alert' + e);
				} else {

					console.log('SMS alert with message id ' + message.sid + " sent to " + element + " at" + message.dateCreated);
				}
			});
		}
	});
	//});
};

module.exports = SMSClient;
