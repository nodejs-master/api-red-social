'use strict'

var bcrypt = require('bcrypt-nodejs');

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

function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email}, (err, user) => {
       if(err) return res.status(500).send({ message: 'Error en la peticion'});

       if(user){
           // El metodo compare valida que la contraseña en claro sea igual a la encriptada
           bcrypt.compare(password, user.password, (err, check) => {
               if(check){
                    // Devolver datos del usuario
                   return res.status(200).send({user})
               }else{
                   if(err) return res.status(404).send({ message: 'El usuario no se ha podido identificar'});
               }
           });
       }else{
           if(err) return res.status(404).send({ message: 'El usuario no se ha podido identificar!!'});
       }
    });
}

module.exports =  {
    home,
    pruebas,
    saveUser,
    loginUser
}