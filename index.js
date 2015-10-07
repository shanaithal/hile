var express = require('express'),
    connector = require('./utilities/dbconnector'),
    cors = require('cors'),
    logger = require('morgan'),
    loggerRotator = require('file-stream-rotator'),
    fileStream = require('fs'),
    bodyParser = require('body-parser'),
    date = new Date(),
    PORT = 8080;

var currentDate = date.getDate() + '-' + date.getMonth() + 1 + '-' + date.getFullYear(),
    logDIR = __dirname + '/logs',
    logFileName = logDIR + '/access_logs-' + currentDate + '.log';
fileStream.existsSync(logDIR) || fileStream.mkdirSync(logDIR);
var accessLogStream = loggerRotator.getStream({
    filename: logFileName,
    verbose: false
});

var app = express();
app.use(new cors());
/*app.use(bodyParser.urlencoded({
    extended: true
}));*/
app.use(bodyParser.json());
app.use(logger('combined', {
    skip: function(request, response) {
        return response.statusCode < 400;
    },
    stream: accessLogStream
}));

app.post('/users', function(request, response) {

    var userObject = request.body;
    connector.createUser(function(user) {
        if (user.name == userObject.name) {
            response.statusCode = 201;
            response.send("Created");
        } else {
            response.statusCode = 500;
            response.send("Internal Server Error");
        }
    }, userObject);

});

app.put('/users/:email', function(request, response) {

    var userObject = request.body;
    if (userObject.email === undefined) {
        userObject.email = request.params.email;
    } else if (userObject.email != request.params.email) {
        sendBadRequestError(response);
    }
    connector.updateUser(function(status) {
        if (status == 200) {
            response.statusCode = 200;
            response.send();
        } else {
            sendInternalServerError(response);
        }

    }, userObject);
});

app.get('/users', function(request, response) {

    connector.getUsers(function(users) {
        if (isNaN(users)) {
            response.statusCode = 200;
            response.send(getJSONResponse(users));
        } else {
            sendNotFoundError(response);
        }
    }, getQueryObject(request));
});

app.get('/users/:email', function(request, response) {

    var userObj = getQueryObject(request);
    userObj.email = request.params.email;
    connector.getUsers(function(user) {
        if (user === undefined || !isNaN(user)) {
            sendNotFoundError(response);
        } else {
            response.statusCode = 200;
            response.send(getJSONResponse(user));
        }
    }, userObj);
});

app.delete('/users/:email', function(request, response) {

    var email = request.params.email;
    connector.deleteUser(function(status) {
        if (status == 200) {
            response.statusCode = 200;
            response.send();
        } else {
            sendInternalServerError(response);
        }
    }, email);
});
/////////////////////////////////////////////////////////////////////////////////////////

app.post('/users/:email/homes', function(request, response) {

    var homeObject = request.body;
    if (homeObject.owner_mail != request.params.email) {
        sendBadRequestError(response);
    }
    connector.createHome(function(status) {
        if (status == 201) {
            response.statusCode = 201;
            response.send();
        } else {
            sendInternalServerError(response);
        }
    }, homeObject);
});

app.put('/users/:email/homes/:home_name', function(request, response) {

    var homeObject = request.body;
    if (homeObject.owner_mail === undefined) {
        homeObject.owner_mail = request.params.email;
    } else if (homeObject.owner_mail != request.params.email ||
        homeObject.name != request.params.home_name) {
        sendBadRequestError(response);
    }
    connector.updateHome(function(status) {
        if (status == 200) {
            response.statusCode = 200;
            response.send();
        } else {
            sendInternalServerError(response);
        }
    }, homeObject);
});

app.get('/homes', function(request, response) {
    connector.getHomes(function(homes) {
        if (homes !== undefined && isNaN(homes)) {
            response.statusCode = 200;
            response.send(getJSONResponse(homes));
        } else {
            sendNotFoundError(response);
        }
    }, getQueryObject(request));
});

app.get('/homes/:home_name', function(request, response) {

    var homeObj = getQueryObject(request);
    homeObj.name = request.params.home_name;
    connector.getHomes(function(homes) {
        if (homes !== undefined && isNaN(homes)) {
            response.statusCode = 200;
            response.send(getJSONResponse(homes));
        } else {
            sendNotFoundError(response);
        }
    }, homeObj);
});

app.delete('/users/:email/homes/:home_name', function(request, response) {

    var homeObject = {
        owner_mail: request.params.email,
        name: request.params.home_name
    };
    connector.deleteHome(function(status) {
        if (status == 200) {
            response.statusCode = 200;
            response.send();
        } else {
            sendInternalServerError(response);
        }
    }, homeObject);
});

/////////////////////////////////////////////////////////////////////////////////////////

app.post('/users/:email/homes/:home_name/products', function(request, response) {

    var productObject = request.body;
    connector.createProduct(function(status) {
        if (status == 201) {
            response.statusCode = 201;
            response.send();
        } else {
            sendInternalServerError(response);
        }
    }, productObject);
});

app.put('/users/:email/homes/:home_name/products/:product_name', function(request, response) {
    var productObject = request.body,
        owner_mail = request.params.email,
        home_name = request.params.home_name,
        product_name = request.params.product_name;
    if (productObject.owner_mail === undefined || productObject.owner_mail != owner_mail) {
        productObject.owner_mail = request.params.email;
    }
    if (productObject.home_name === undefined || productObject.home_name != home_name) {
        productObject.home_name = home_name;
    }
    if (productObject.name === undefined || productObject.name != product_name) {
        productObject.name = product_name;
    }
    connector.updateProduct(function(status) {
        if (status == 200) {
            response.statusCode = 200;
            response.send();
        } else {
            sendInternalServerError(response);
        }
    }, productObject);
});

app.get('/products', function(request, response) {
    var productObj = getQueryObject(request);
    connector.getProducts(function(products) {
        if (products !== undefined && isNaN(products)) {
            response.statusCode = 200;
            response.send(products);
        } else {
            sendNotFoundError(response);
        }
    }, productObj);
});

app.get('/products/:product_name', function(request, response) {
    var productObj = getQueryObject(request);
    productObj.name = request.params.product_name;
    connector.getProducts(function(products) {
        if (products !== undefined && isNaN(products)) {
            response.statusCode = 200;
            response.send(products);
        } else {
            sendNotFoundError(response);
        }
    }, productObj);
});

app.listen(PORT);
console.log('Server running at:: localhost:' + PORT);

app.delete('/users/:email/homes/:home_name/products/:product_name', function(request, response) {
    var productObject = {
        name: request.params.product_name,
        home_name: request.params.home_name,
        owner_mail: request.params.email
    };
    connector.deleteProduct(function(status) {
        if (status == 200) {
            response.statusCode = 200;
            response.send();
        } else {
            sendInternalServerError(response);
        }
    }, productObject);
});

function getJSONResponse(data) {
    if (data !== undefined &&
        data.toString().indexOf('[') === -1 && data.toString().indexOf(']') === -1) {
        data = "[" + data + "]";
    }
    data = "{data:" + data + "}";
    var response = JSON.stringify(eval("(" + data + ")"));
    return response;
}

function sendNotFoundError(response) {

    response.statusCode = 404;
    response.send("Resource Not Found");
}

function sendInternalServerError(response) {
    response.statusCode = 500;
    response.send("Internal Server Error");
}

function sendBadRequestError(response) {
    response.statusCode = 400;
    response.send("Bad Request");
}

function getQueryObject(queryArgs) {

    var queryObj = {};
    for (var queryParam in queryArgs.query) {
        queryObj[queryParam] = queryArgs.query[queryParam];
    }
    return queryObj;
}
