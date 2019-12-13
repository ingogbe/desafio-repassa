var firebaseAdmin = require('firebase-admin');
var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var Ajv = require('ajv');
var passport = require("passport");
var logger = require('morgan');
var env = require('dotenv').config();

var ajv = new Ajv({
	allErrors: true, 
	format: 'full', 
	$data: true,
	jsonPointers: true
});

var app = express();

app.use(logger('dev'));

app.use(passport.initialize());

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

consign()
   .include('utils')
   .then('config/files')
   .then('validation')
	.then('config/database.js')
	.then('config')
	.then('models')
	.then('controllers')
	.then('routes')
	.into(app, firebaseAdmin, ajv, passport);

var port = process.env.PORT || app.config.files.fallback.PORT;

app.listen(port, function () {
   console.log('Servidor rodando em http://localhost:%s', port);
});

module.exports = app;