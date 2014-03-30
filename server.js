/**
 * Created by gongchen on 14-3-4.
 * Express is a web development module for Node.js. Mongoose is a Node.js ORM module for working with MongoDB database.

 * Creating Server and Connecting to MongoDB

 * The following code block will create the server using express module and connecting to the MongoDB database using the Mongoose
 */

//Creating server
var express = require('express')
	, app = express.createServer()
	, mongoose = require('mongoose');

//Connecting to MongoDB
mongoose.connect('mongodb://localhost/ProductDB');


/**
 * Creating the Model using Mongoose
 * Let’s define the Model objects using the Mongoose
 */

//Models using Mongoose
var Schema = mongoose.Schema
	, ObjectId = Schema.ObjectID;

var Product = new Schema({
	name: { type: String, required: true, trim: true }, 
	unitPrice: { type: Number, required: true }, 
	itemsInStock: { type: Number, required: true }
});

var Category = new Schema({
	name: { type: String, required: true, trim: true }, 
	description: { type: String, required: true, trim: true }, 
	products: [Product]
});

var ProductCatalog = mongoose.model('Category', Category);

/**
 * Exposing the API methods
 * The following function returns the all product catalog information as a JSON string. The request for ‘/’ will return the all product catalog data.
 */

//Get all product catalog
app.get('/', function (req, res) {
	ProductCatalog.find({}, function (error, data) {
		if (error) {
			res.json(error);
		} else if (data == null) {
			res.json('Empty data OR Data not found!')
		} else {
			res.json(data);
		}

	});
});
//Get a specified category
app.get('/:name', function (req, res) {
	ProductCatalog.findOne({ name: req.params.name }, function (error, category) {
		if (error) {
			res.json(error, category);
		} else if (category == null) {
			res.json('Category not found!');
		} else {
			res.json(category);
		}
	});
});

//Add category
app.get('/addcategory/:name/:description', function (req, res) {
	var categoryData = {
		name: req.params.name, 
		description: req.params.description
	};

	var category = new ProductCatalog(categoryData);
	//Save data
	category.save(function (error, data) {
		if (error) {
			res.json(error);
		}else{
			res.json(data);
		}
	});
});
//Add product to a category
app.get('/addproduct/:category/:name/:unitPrice/:itemsInStock', function (req, res) {
	ProductCatalog.findOne({ name: req.params.category }, function (error, category) {
		if (error) {
			res.json(error);
		}
		else if (category == null) {
			res.json('Category not found!')
		}
		else {
			category.products.push({ name: req.params.name, unitPrice: req.params.unitPrice, itemsInStock: req.params.itemsInStock });
			category.save(function (error, data) {
				if (error) {
					res.json(error);
				}
				else {
					res.json(data);
				}
			});
		}
	});
});

app.listen(8000);
console.log("listening on port %d", app.address().port);