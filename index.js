'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

// Conexión DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/red-social', { useMongoClient: true})
        .then(()=> {
            console.log("La conexion a la base de datos se realizo perfectamente")

            // Crear servidor
            app.listen(port, ()=> {
                console.log("Servidor corriendo en http://localhost:3800")
            })
        })
        .catch(err => console.log(err));
