/**
 * Created by gongchen on 14-3-4.
 * Express is a web development module for Node.js. Mongoose is a Node.js ORM module for working with MongoDB database.

 * Creating Server and Connecting to MongoDB

 * The following code block will create the server using express module and connecting to the MongoDB database using the Mongoose
 */

/****************************************************************************************************/
/***==============================================================================================***/

var express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	app = express();

// Database
mongoose.connect('mongodb://localhost/ecomm_database');

// Config

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


// Setup a Simple Model Using CRUD (create, read, update, delete)

var Schema = mongoose.Schema; //Schema.ObjectId

// Schemas
var Sizes = new Schema({
	size: {type: String, required: true},
	available: {type: Number, required: true, min: 0, max: 1000},
	sku: {
		type: String,
		required: true,
		validate: [ /[a-zA-Z0-9]/, 'Product sku should only have letters and numbers']
	},
	price: {type: Number, required: true, min: 0}
});

var Images = new Schema({
	kind: {
		type: String,
		enum: ['thumbnail', 'catalog', 'detail', 'zoom'],
		required: true
	},
	url: {type: String, required: true}
});

var Variants = new Schema({
	color: String,
	images: [Images],
	sizes: [Sizes]
});

var Categories = new Schema({
	name: String
});

var Catalogs = new Schema({
	name: String
});


// Product Model
var Product = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	style: { type: String, unique: true },
	images: [Images],
	categories: [Categories],
	catalogs: [Catalogs],
	variants: [Variants],
	modified: { type: Date, default: Date.now }
});
var ProductModel = mongoose.model('Product', Product);


// CRUD methods serving up a RESTful service

app.get('/api/products', function (req, res){
	return ProductModel.find(function (err, products) {
		if (!err) {
			return res.send(products);
		} else {
			return console.log(err);
		}
	});
});
// CREATE a products
app.post('/api/products', function (req, res){
	var product;
	console.log("POST: ");
	console.log(req.body);
	product = new ProductModel({
		title: req.body.title,
		description: req.body.description,
		style: req.body.style,
		images: [Images]
	});
	product.save(function (err) {
		if (!err) {
			return console.log("created");
		} else {
			return console.log(err);
		}
	});
	return res.send(product);
});

app.get('/api/products/:id', function (req, res){
	return ProductModel.findById(req.params.id, function (err, product) {
		if (!err) {
			return res.send(product);
		} else {
			return console.log(err);
		}
	});
});
// UPDATE a single product
app.put('/api/products/:id', function (req, res){
	return ProductModel.findById(req.params.id, function (err, product) {
		product.title = req.body.title;
		product.description = req.body.description;
		product.style = req.body.style;
		product.images = req.body.images;
		return product.save(function (err) {
			if (!err) {
				console.log("updated");
			} else {
				console.log(err);
			}
			return res.send(product);
		});
	});
});

app.delete('/api/products/:id', function (req, res){
	return ProductModel.findById(req.params.id, function (err, product) {
		return product.remove(function (err) {
			if (!err) {
				console.log("removed");
				return res.send('');
			} else {
				console.log(err);
			}
		});
	});
});

app.delete('/api/products', function(req, res) {
	ProductModel.remove(function (err) {
		if(!err) {
			console.log("removed");
			return res.send('');
		} else {
			console.log(err);
		}
	})
});

app.put('/api/products', function(req, res) {
	var i, len = 0;
	console.log("is Array req.body.products");
	console.log(Array.isArray(req.body.products));
	console.log("PUT: (products)");
	console.log(req.body.products);
	if (Array.isArray(req.body.products)) {
		len = req.body.products.length;
	}
	for (i = 0; i < len; i++) {
		console.log("UPDATE product by id:");
		for (var id in req.body.products[i]) {
			console.log(id);
		}
		ProductModel.update({ "_id": id }, req.body.products[i][id], function (err, numAffected) {
			if (err) {
				console.log("Error on update");
				console.log(err);
			} else {
				console.log("updated num: " + numAffected);
			}
		});
	}
	return res.send(req.body.products);
});

app.get('/api', function (req, res) {
	res.send('Ecomm API is running');
});

// Launch server

app.listen(4242);

//mongod run --config /usr/local/Cellar/mongodb/2.0.1-x86_64/mongod.conf

//using jQuery ($.ajax) POST to create a new product

jQuery.post("/api/products", {
	"title": "My Awesome T-shirt",
	"description": "All about the details. Of course it's black.",
	"style": "12345",
	"images": [
		{
			"kind": "thumbnail",
			"url": "images/products/1234/main.jpg"
		}
	],
	"categories": [
		{"name": "Clothes"},
		{"name": "Shirts"}
	],
	"style": "1234",
	"variants": [
		{
			"color": "Black",
			"images": [
				{
					"kind": "thumbnail",
					"url": "images/products/1234/thumbnail.jpg"
				},
				{
					"kind": "catalog",
					"url": "images/products/1234/black.jpg"
				}
			],
			"sizes": [
				{
					"size": "S",
					"available": 10,
					"sku": "CAT-1234-Blk-S",
					"price": 99.99
				},
				{
					"size": "M",
					"available": 7,
					"sku": "CAT-1234-Blk-M",
					"price": 109.99
				}
			]
		}
	],
	"catalogs": [
		{"name": "Apparel"}
	]
}, function (data, textStatus, jqXHR) {
	console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
});

//The post response is something like:
/*
_id: "4f34d8e7f05ebf212b000004"
description: "All about the details. Of course it's black."
modified: "2012-02-10T08:44:23.372Z"
style: "12345"
title: "My Awesome T-shirt"
*/

jQuery.get("/api/products/", function (data, textStatus, jqXHR) {
	console.log("Get resposne:");
	console.dir(data);
	console.log(textStatus);
	console.dir(jqXHR);
});


jQuery.get("/api/products/4f34d8e7f05ebf212b000004", function(data, textStatus, jqXHR) {
	console.log("Get resposne:");
	console.dir(data);
	console.log(textStatus);
	console.dir(jqXHR);
});


jQuery.ajax({
	url: "/api/products/4f34d8e7f05ebf212b000004",
	type: "PUT",
	data: {
		"title": "My Awesome T-shirt in Black",
		"description": "All about the details. Of course it's black, and long sleeve",
		"style": "12345"
	},
	success: function (data, textStatus, jqXHR) {
		console.log("Post resposne:");
		console.dir(data);
		console.log(textStatus);
		console.dir(jqXHR);
	}
});

jQuery.get("/api/products/4f34d8e7f05ebf212b000004");

jQuery.ajax({
	url: "/api/products/4f34d8e7f05ebf212b000004",
	type: "DELETE",
	success: function (data, textStatus, jqXHR) {
		console.log("Post resposne:");
		console.dir(data);
		console.log(textStatus);
		console.dir(jqXHR);
	}
});