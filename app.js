'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar Rutas


// Middlewares
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

// cors


// rutas
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hola Mundo desde servidor Node JS'
    });
});

app.get('/pruebas', (req, res) => {
    res.status(200).send({
        message: 'Probando ruta de prueba'
    });
});

// exportar
module.exports = app;