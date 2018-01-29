'use strict'

var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var jwt = require('../services/jwt');

// Metodo de home
function home(req, res){
    res.status(200).send({
        message: 'Hola Mundo desde servidor Node JS'
    });
}
// Metodo de Prueba
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando ruta de prueba'
    });
}
// Metodo de registro de usuario
function saveUser(req, res){
    var params = req.body;
    var user = new User();

    if(params.name && params.surname && params.nick && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        // Controlar user duplicados
        User.find({ $or: [
                 { email: user.email.toLowerCase() },
                 { nick: user.nick.toLowerCase() }
             ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error al guardar el usuario'});

            if(users && users.length >= 1){
                return res.status(200).send({ message: 'El usuario que intenta registrar ya existe'});
            }else{
                // Guardar contraseña cifrada con bcrypt
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if(err) return res.status(500).send({ message: 'Error al guardar el usuario'});

                        if(userStored){
                            res.status(200).send({user: userStored });
                        }else{
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }
                    })
                })
            }
        });



    }else{
        res.status(200).send({
            message: 'Envia todos los campos necesarios!!'
        });
    }
}
// Metodo de Login
function loginUser(req, res){

    // Comprobar que el usuario existe
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({ message: 'Error al comprobar que el usuario existe' });
        }else{
            if(user){
                bcrypt.compare(password, user.password, (err, check) => {
                    if(check){
                        // Comprobar si existe gettoken y Generar el Token
                        if (params.gettoken) {
                            // Devolver el Token
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            user.password = undefined;
                            res.status(200).send({user});
                        }

                    }else{
                        res.status(404).send({
                            message: 'El usuario no ha podido loguearse correctamente'
                        });
                    }
                });
            }else{
                res.status(404).send({
                    message: 'El usuario no ha podido loguearse'
                });
            }
        }
    });
}
// Conseguir datos de un usuario
function getUser(req, res){
    var userId = req.params.id;

    User.findById(userId, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!user) return res.status(404).send({message: 'El usuario no existe'});

        return res.status(200).send({user});
    })

}
// Devolver un listado de usuarios paginados
function getUsers(req, res){
    var identity_user_id = req.user.sub;

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!users) return res.status(404).send({message: 'El usuario no hay usuarios disponibles'});

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    })
}
// Edicion de datos de usuario
function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    // borrar la propiedad password
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

        return res.status(200).send({ user: userUpdated })
    })

}
// Subir imagenes


module.exports =  {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser
}