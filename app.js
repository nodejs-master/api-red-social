'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar Rutas
var user_routes = require('./routes/user');

// Middlewares
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

// cors


// Middleware rutas
app.use('/api', user_routes);


// exportar
module.exports = app;