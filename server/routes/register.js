const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');
const crypt = require('../config/crypt');
const token = require('../config/token');

router
    .post('/',(req,res)=>{
        if(req.body.mdp && req.body.nom && req.body.prenom && req.body.mail) {
            req.body.mdp = crypt.encrypt(req.body.mdp);//crypter le mot de passe avant de l'envoyer
            models.utilisateur.create(req.body).then((utilisateur) => {
                res.status(201).send({
                    status: 201,
                    data: utilisateur.get({plain: true}),//Transformer l'objet en json simple
                    message: ""
                });
            }).catch((err) => {
                err.status = 422;
                res.status(err.status).send(errorHandler(err));
            })
        }else{
            res.status(422).send({
                status:422,
                data:{},
                message:"Form invalids data"
            })
        }
    });
module.exports = router;