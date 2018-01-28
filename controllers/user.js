'use strict'

var User = require('../models/user');

function home(req, res){
    res.status(200).send({
        message: 'Hola Mundo desde servidor Node JS'
    });
}

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando ruta de prueba'
    });
}

module.exports =  {
    home,
    pruebas
}