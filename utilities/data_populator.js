var faker = require('faker');
var connector = new require('./dbconnector')();

var NUMBER_OF_USERS = 1;
var NUMBER_OF_HOMES_PER_USERS = 2;
//Generate Dummy Data

for (var index = 0; index < NUMBER_OF_USERS; index++) {

	connector.createUser(function (err, user) {

		if (err) {

			console.log("Could not create User: " + err);
		} else {

			console.log("User created Successfully: " + user.email);
			for (var innerIndex = 0; innerIndex < NUMBER_OF_HOMES_PER_USERS; innerIndex++) {

				connector.createHome(function (err, home) {

					if (err) {

						console.log("Could not create Home for user: " + user.mail + " \n" + err);
					} else {

						console.log("Home created successfully: " + home._id);
					}
				}, getHome(user));
			}
		}
	}, getUser());
}

connector.createCategory(function (err, category) {

	if (err) {

		console.log("Category could not be created: " + err);
	} else {

		console.log("Category created Successfully: " + category.name);
	}
}, getCategory());

connector.createCategory(function (err, category) {

	if (err) {

		console.log("Category could not be created: " + err);
	} else {

		console.log("Category created Successfully: " + category.name);
	}
}, getCategoryWithSubCategories());

function getUser() {

	var userObject = {
		name: faker.name.findName(),
		email: faker.internet.email(),
		contact: faker.phone.phoneNumberFormat().replace(/-/g, ""),
		rating: (faker.random.number() % 5)
	};

	return userObject;
}

function getHome(owner) {

	var homeObject = {
		name: owner.name.replace(new RegExp(" ", 'g'), "") + "_home" + (faker.random.number() % (NUMBER_OF_USERS * NUMBER_OF_HOMES_PER_USERS)),
		owner_mail: owner.email,
		owner_id: owner._id,
		location: {
			address1: faker.address.streetAddress(),
			address2: faker.address.streetName(),
			town: faker.address.city(),
			state: faker.address.state(),
			pincode: faker.address.zipCode().replace(/-/g, "")
		}
	};

	return homeObject;
}

function getCategory() {

	var categoryObject = {
		name: "rent",
		description: "renting"
	};

	return categoryObject;
}

function getCategoryWithSubCategories() {

	var categoryObjectWithSubCategories = {

		name: "home_made_food",
		description: "home_made_food",
		sub_categories: [
			{
				name: "sub_1",
				description: "sub_desc_1"
			},
			{
				name: "sub_2",
				description: "sub_desc_2"
			}
		]
	};

	return categoryObjectWithSubCategories;
}