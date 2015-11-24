var express = require('express'),
    cors = require('cors'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    PORT = process.env.PORT || 3000,
    app = new express();

app.use(new cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/app'));
app.get('/', function(request, response) {
	response.render('./app/index.html');
});
app.use('/api', require('./router'));

app.listen(PORT);
console.log('Server running at : ' + PORT);
