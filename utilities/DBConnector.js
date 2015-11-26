var mongoose = require('mongoose'),
    User = require('../models/User'),
    Home = require('../models/Home'),
    Product = require('../models/Product'),
    Buzz = require('../models/Buzz'),
    Review = require('../models/Review'),
    Category = require('../models/Category'),
    Image = require('../models/Image'),
    fs = require('fs'),
    fieldsNotInResponse = {
        '__v': 0
    };

if (mongoose.connection.readyState === 0) {
    mongoose.connect('mongodb://demo:demo@ds029454.mongolab.com:29454/heroku_n6nkk9m5');
    // mongoose.connect('mongodb://127.0.0.1/hile');
}


var DBConnector = function() {
    var dbConnectorObject = Object.create(DBConnector.prototype);
    return dbConnectorObject;
};

DBConnector.prototype.createUser = function(callback, userObject) {

    var user = new User({
        name: userObject.name,
        email: userObject.email,
        contact: userObject.contact,
        rating: userObject.rating
    });
    user.save(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

DBConnector.prototype.updateUser = function(callback, userObject) {

    User.findOneAndUpdate({
        email: userObject.email
    }, userObject, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

DBConnector.prototype.getUsers = function(callback, userObject, paginationParams) {

    var paginationConfig = getPaginationConfig(paginationParams);
    User.find(userObject, fieldsNotInResponse, paginationConfig).lean().exec(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.stringify(data));
        }
    });
};

DBConnector.prototype.deleteUser = function(callback, email) {

    User.findOneAndRemove({
        email: email
    }, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

DBConnector.prototype.createHome = function(callback, homeObject) {

    User.findOne({
        email: homeObject.owner_mail
    }, 'email', function(err, data) {
        if (err) {
            callback(err);
        } else {
            var home = new Home({
                name: homeObject.name,
                location: homeObject.location,
                owner_mail: homeObject.owner_mail
            });
            home.save(function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, data);
                }
            });
        }
    });
};

DBConnector.prototype.updateHome = function(callback, homeObject) {

    Home.findOneAndUpdate({
            name: homeObject.name,
            owner_mail: homeObject.owner_mail
        }, homeObject,
        function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
};

DBConnector.prototype.getHomes = function(callback, homeObject) {

    Home.find(homeObject, fieldsNotInResponse).lean().exec(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.stringify(data));
        }
    });
};

DBConnector.prototype.deleteHome = function(callback, homeObject) {

    Home.findOneAndRemove({
        name: homeObject.name,
        owner_mail: homeObject.owner_mail
    }, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

DBConnector.prototype.createProduct = function(callback, productObject) {

    Home.findOne({
        name: productObject.home_name,
        owner_mail: productObject.owner_mail
    }, function(err, data) {
        if (err) {
            callback(err);
        } else {
            Category.findOne({
                name: productObject.category
            }, function(err, data) {
                if (err) {
                    callback(err);
                } else {
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
                            callback(err);
                        } else {
                            callback(null, data);
                        }
                    });
                }
            });
        }
    });
};

DBConnector.prototype.updateProduct = function(callback, productObject) {

    var queryObject = {
        name: productObject.name,
        home_name: productObject.home_name,
        owner_mail: productObject.owner_mail
    };
    Product.findOneAndUpdate(queryObject, productObject, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

DBConnector.prototype.getProducts = function(callback, paginationParams, productObject) {

    var paginationConfig = getPaginationConfig(paginationParams);
    Product.find(productObject, fieldsNotInResponse, paginationConfig).lean().exec(function(err, data) {
        if (err) {
            callback(err);
        } else {
            data = getImages(data, 3, "product");
            callback(null, JSON.stringify(data));
        }
    });
};

DBConnector.prototype.deleteProduct = function(callback, productObject) {

    Product.findOneAndRemove({
        name: productObject.name,
        home_name: productObject.home_name,
        owner_mail: productObject.owner_mail
    }, function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

module.exports = DBConnector;

DBConnector.prototype.createCategory = function(callback, categoryObject) {

    var category = new Category({
        name: categoryObject.name,
        description: categoryObject.description,
        subcatrgories: categoryObject.subcatrgories
    });

    category.save(function(err, data) {

        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

DBConnector.prototype.getCategories = function(callback, categoryObject) {

    Category.find(categoryObject, fieldsNotInResponse).lean().exec(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.stringify(data));
        }
    });
};

DBConnector.prototype.uploadImage = function(callback, imagePath, entityObject) {

    switch (entityObject.type.toLowerCase()) {
        case "product":
            Product.findOne({
                _id: entityObject.id
            }, function(err, data) {
                if (err) {
                    callback(err);
                    console.log("Error Caught");
                }
            });
            break;
        case "home":
            Home.findOne({
                _id: entityObject.id
            }, function(err, data) {
                if (err) {
                    callback(err);
                    console.log("Error Caught");
                }
            });
            break;
    }

    var image = new Image();
    image.data = fs.readFileSync(imagePath);
    image.content_type = imagePath.split(".")[1];
    image.entity_type = entityObject.type;
    image.entity_id = entityObject.id;
    console.log(image.entity_id);
    console.log(entityObject.id);

    image.save(function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

DBConnector.prototype.downloadImages = function(callback, entityObject) {
    
    Image.find(entityObject, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};


function getPaginationConfig(paginationParams) {

    var paginationConfig;
    if (paginationParams !== undefined) {
        if (paginationParams.page !== undefined && paginationParams.count !== undefined && !isNaN(paginationParams.page) && !isNaN(paginationParams.count)) {
            var skip = paginationParams.page * paginationParams.count,
                limit = paginationParams.count;
            paginationConfig = {};
            paginationConfig.skip = skip;
            paginationConfig.limit = limit;
        }
    }
    return paginationConfig;
}

function getImages(data, limit, entity_type) {

    if (!isArray(data)) {
        data = [data];
    }

    var clone = JSON.parse(JSON.stringify(data));
    clone.forEach(function(element, index) {
        Image.find({
                entity_id: element._id,
                entity_type: entity_type
            }, fieldsNotInResponse, {
                skip: 0,
                limit: limit
            }, function(err, images) {
                if (!err) {
                    clone[index].images = [];
                    images.forEach(function(image, imageIndex) {
                            clone[index].images.push({
                                data: image.data.toString()
                            });
                        });
                    } else {
                        console.log(err);
                    }
                    return clone;
                });
        });
}

function isArray(array) {
    return array.constructor === Array;
}