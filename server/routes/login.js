const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');
const crypt = require('../config/crypt');
const token = require('../config/token');

router
    .post('/',(req,res)=>{
        models.utilisateur.findOne({
            where: {mail: req.body.mail},
            attributes: ['id', 'est_admin', 'mdp']
        }).then((utilisateur)=>{
            if(utilisateur === null || crypt.decrypt(utilisateur.mdp) !== req.body.mdp){
                res.status(403).send({
                    status:403,
                    data:{},
                    message:"Invalid credential"
                })
            }else{//La personne existe et son mot de passe est bon on lui crée le token
                token.encrypt({
                    id:utilisateur.id
                }).then((token_created)=>{
                    res.status(200).send({
                        status:200,
                        data:{
                            token: token_created,
                            utilisateur: {
                                id: utilisateur.id,
                                est_admin: utilisateur.est_admin
                            }
                        },
                        message:"User logged"
                    });
                });
            }
        }).catch(err=>{
            err.status = 422;
            res.status(err.status).send(errorHandler(err));
        })
    });
module.exports = router;