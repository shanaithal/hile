var config = {
	dbHost: "mongodb://demo:demo@ds029454.mongolab.com:29454",
	databaseName: "heroku_n6nkk9m5",
	service_url: "https://hile.herokuapp.com/api",
	defaultSkip: 0,
	defaultLimit: 25,
	maxCount: 50,
	twilio: {
		account_sid: 'ACe21245ab7a9d40692353753534f1a13a',
		auth_token: '27e9e27ee5892277c0f5aa36c449f441',
		from_number: '+1 972-996-7229'
	},
	smsAlertNumbers: [
			'+918971127755'
	]
};

module.exports = config;
