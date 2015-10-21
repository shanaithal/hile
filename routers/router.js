var router = require('express').Router(),
    DBConnector = require('../utilities/DBConnector');
var connector = new DBConnector();

router.get('/', function(request, response) {
    var welcomeMsg = {
        message: "Welcome to HILE"
    };
    response.send(JSON.stringify(welcomeMsg));
});

router.post('/users', function(request, response) {

    var userObject = request.body;
    connector.createUser(function(err, user) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 201;
            response.send("Created");
        }
    }, userObject);
});

router.put('/users/:email', function(request, response) {

    var userObject = request.body;
    if (userObject.email === undefined) {
        userObject.email = request.params.email;
    } else if (userObject.email != request.params.email) {
        sendBadRequestError(response);
    }
    connector.updateUser(function(err, data) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 200;
            response.send();
        }

    }, userObject);
});

router.get('/users', function(request, response) {

    connector.getUsers(function(err, data) {
        if (err) {
            sendNotFoundError(response);
        } else {
            response.statusCode = 200;
            response.send(getJSONResponse(data));
        }
    }, getQueryObject(request));
});

router.get('/users/:email', function(request, response) {

    var userObj = getQueryObject(request);
    userObj.email = request.params.email;
    connector.getUsers(function(err, data) {
        if (err) {
            sendNotFoundError(response);
        } else {
            response.statusCode = 200;
            response.send(getJSONResponse(data));
        }
    }, userObj);
});

router.delete('/users/:email', function(request, response) {

    var email = request.params.email;
    connector.deleteUser(function(err) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 200;
            response.send();
        }
    }, email);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/users/:email/homes', function(request, response) {

    var homeObject = request.body;
    if (homeObject.owner_mail != request.params.email) {
        sendBadRequestError(response);
    }
    connector.createHome(function(err, data) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 201;
            response.send();
        }
    }, homeObject);
});

router.put('/users/:email/homes/:home_name', function(request, response) {

    var homeObject = request.body;
    if (homeObject.owner_mail === undefined) {
        homeObject.owner_mail = request.params.email;
    } else if (homeObject.owner_mail != request.params.email ||
        homeObject.name != request.params.home_name) {
        sendBadRequestError(response);
    }
    connector.updateHome(function(err, data) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 200;
            response.send();
        }
    }, homeObject);
});

router.get('/homes', function(request, response) {
    connector.getHomes(function(err, data) {
        if (err) {
            sendNotFoundError(response);
        } else {
            response.statusCode = 200;
            response.send(getJSONResponse(data));
        }
    }, getQueryObject(request));
});

router.get('/homes/:home_name', function(request, response) {

    var homeObj = getQueryObject(request);
    homeObj.name = request.params.home_name;
    connector.getHomes(function(err, data) {
        if (err) {
            sendNotFoundError(response);
        } else {
            response.statusCode = 200;
            response.send(getJSONResponse(data));
        }
    }, homeObj);
});

router.delete('/users/:email/homes/:home_name', function(request, response) {

    var homeObject = {
        owner_mail: request.params.email,
        name: request.params.home_name
    };
    connector.deleteHome(function(err, data) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 200;
            response.send();
        }
    }, homeObject);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/users/:email/homes/:home_name/products', function(request, response) {

    var productObject = request.body;
    connector.createProduct(function(err, data) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 201;
            response.send();
        }
    }, productObject);
});

router.put('/users/:email/homes/:home_name/products/:product_name', function(request, response) {

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
    connector.updateProduct(function(err, data) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 200;
            response.send();
        }
    }, productObject);
});

router.get('/products', function(request, response) {

    var productObj = getQueryObject(request);
    connector.getProducts(function(err, data) {
        if (err) {
            sendNotFoundError(response);
        } else {
            response.statusCode = 200;
            response.send(getJSONResponse(data));
        }
    }, productObj);
});

router.get('/products/:product_name', function(request, response) {

    var productObj = getQueryObject(request);
    productObj.name = request.params.product_name;
    connector.getProducts(function(err, data) {
        if (err) {
            sendNotFoundError(response);
        } else {
            response.statusCode = 200;
            response.send(getJSONResponse(data));
        }
    }, productObj);
});

router.delete('/users/:email/homes/:home_name/products/:product_name', function(request, response) {
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/categories', function(request, response){

    var categoryObject = request.body;
    console.log(categoryObject);
    connector.createCategory(function(err, user) {
        if (err) {
            sendInternalServerError(response);
        } else {
            response.statusCode = 201;
            response.send("Created");
        }
    }, categoryObject);
});

router.get('/categories', function(request, response) {

    connector.getCategories(function(err, data) {
        if (err) {
            sendNotFoundError(response);
        } else {
            response.statusCode = 200;
            response.send(getJSONResponse(data));
        }
    }, getQueryObject(request));
});

function getJSONResponse(data) {
    if (data !== undefined &&
        data.toString().indexOf('[') === -1 && data.toString().indexOf(']') === -1) {
        data = "[" + data + "]";
    }
    data = "{\"data\":" + data + "}";
    var response = /*JSON.stringify(*/ data /*)*/ ;
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

module.exports = router;