var mongoose = require('mongoose'),
    User = require('../models').User,
    Home = require('../models').Home,
    Product = require('../models').Product,
    fieldsNotInResponse = {
        '_id': 0,
        '__v': 0
    };
mongoose.connect('mongodb://demo:demo@ds029454.mongolab.com:29454/heroku_n6nkk9m5');

exports.createUser = function(callback, userObject) {
    var user = new User({
        name: userObject.name,
        email: userObject.email,
        contact: userObject.contact,
        rating: userObject.rating
    });
    user.save(function(err, data) {
        if (err) {
            console.log(err);
        } else {
            callback(data);
        }
    });
}

exports.getUsers = function(callback, conditionParams) {
    User.find(conditionParams, fieldsNotInResponse, function(err, data) {
        if (err) {
            callback(404);
        } else {
            callback(data);
        }
    });
}

exports.deleteUser = function(callback, email) {
    User.findOneAndRemove({
        email: email
    }, function(err) {
        if (err) {
            callback(500);
        } else {
            callback(200);
        }
    });
}

exports.updateUser = function(callback, userObject) {
    User.findOneAndUpdate({
        email: userObject.email
    }, userObject, function(err, data) {
        if (err) {
            callback(500);
        } else {
            callback(200);
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////

exports.createHome = function(callback, homeObject) {
    User.findOne({
        email: homeObject.owner_mail
    }, 'email', function(err, data) {
        if (err) {
            callback(404);
        } else {
            var home = new Home({
                name: homeObject.name,
                location: homeObject.location,
                owner_mail: homeObject.owner_mail
            });
            home.save(function(err, data) {
                if (err) {
                    callback(500);
                } else {
                    callback(201);
                }
            });
        }
    });
}

exports.getHomes = function(callback, homeObject) {
    Home.find(homeObject, fieldsNotInResponse, function(err, data) {
        if (err) {
            callback(404);
        } else {
            callback(data);
        }
    });
}

exports.deleteHome = function(callback, homeObject) {

    Home.findOneAndRemove({
        name: homeObject.name,
        owner_mail: homeObject.owner_mail
    }, fieldsNotInResponse, function(err) {
        if (err) {
            callback(500);
        } else {
            callback(200);
        }
    });
}

exports.updateHome = function(callback, homeObject) {

    Home.findOneAndUpdate({
            name: homeObject.name,
            owner_mail: homeObject.owner_mail
        }, homeObject,
        function(err, data) {
            if (err) {
                callback(500);
            } else {
                callback(200);
            }
        });
}

///////////////////////////////////////////////////////////////////////////////////////////////////

exports.createProduct = function(callback, productObject) {
    User.findOne({
        email: productObject.owner_mail
    }, function(err, data) {
        if (err) {
            callback(500);
        } else {
            Home.findOne({
                name: productObject.home_name,
                owner_mail: data.email
            }, 'email', function(err, data) {
                var product = new Product({
                    name: productObject.name,
                    description: productObject.description,
                    category: productObject.category,
                    sub_category: productObject.sub_category,
                    home_name: productObject.home_name,
                    owner_mail: productObject.owner_mail,
                    rent_rate: productObject.rent_rate,
                    buzzes: productObject.buzzes,
                    reviews: productObject.reviews
                });
                product.save(function(err, data) {
                    if (err) {
                        callback(500)
                    } else {
                        callback(201);
                    }
                });
            });
        }
    });
}

exports.getProducts = function(callback, productObject) {
    Product.find(productObject, fieldsNotInResponse, function(err, data) {
        if (err) {
            callback(404);
        } else {
            callback(data);
        }
    });
}

exports.deleteProduct = function(callback, productObject) {
    console.log(productObject);
    Product.findOneAndRemove({
        name: productObject.name,
        home_name: productObject.home_name,
        owner_mail: productObject.owner_mail
    }, function(err) {
        if (err) {
            callback(500);
        } else {
            callback(200);
        }
    });
}

exports.updateProduct = function(callback, productObject) {
    console.log(productObject);

    var queryObject = {
        name: productObject.name,
        home_name: productObject.home_name,
        owner_mail: productObject.owner_mail
    };
    console.log(queryObject);
    Product.findOneAndUpdate(queryObject, productObject, function(err, data) {
        if (err) {
            callback(500);
        } else {
            callback(200);
        }
    });
}

/*function getOnCondition (instnaceVar) {
	
	var requestParams = new Object();
	var keys = Object.keys(instnaceVar);
	for(var i=0; i<keys.length; i++){
     	requestParams[keys[i]] = instnaceVar[keys[i]];
	}
	return requestParams;
}*/
