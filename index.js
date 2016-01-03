var express = require('express');
var cors = require('cors');
var logger = require('morgan');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;

var app = new express();

app.use(new cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/app'));
app.get('/', function (request, response) {
	response.render('./app/index.html');
});

app.use('/api', require('./routes/index'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/homes'));
app.use('/api', require('./routes/categories'));
app.use('/api', require('./routes/products'));
app.use('/api', require('./routes/buzzes'));
app.use('/api', require('./routes/search'));
app.use('/api', require('./routes/images'));

app.listen(PORT);

console.log("Server running at: " + PORT);
