const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');
const Token = require('../config/token');
const crypt = require('../config/crypt');

router
    .get('/monprofil',(req,res)=> {
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.decrypt(token).then((data) => {
            models.utilisateur.findById(data.id,{attributes: {exclude:["mdp"]}}).then(utilisateur => {
                if (utilisateur !== null) {
                    res.status(200).send({
                        status: 200,
                        data: {
                            utilisateur: utilisateur
                        },
                        message: ""
                    })
                } else {
                    res.status(404).send({
                        status: 404,
                        data: {},
                        message: ""
                    })
                }
            }).catch(err => {
                err.status = 422;
                res.status(err.status).send(errorHandler(err));
            })
        })
    })
    .get('/',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.isAdmin(token,(isAdmin)=>{
            isAdmin.then(()=> {
                Token.decrypt(token).then((data) => {
                    models.utilisateur.findAll({
                        where:{
                            id:{
                                $ne: data.id
                            }
                        },attributes: {exclude:["mdp"]}
                    }).then(utilisateurs => {
                        res.status(200).send({
                            status: 200,
                            data: {
                                utilisateurs: utilisateurs
                            },
                            message: ""
                        });
                    }).catch(err => {
                        err.status = 422;
                        res.status(err.status).send(errorHandler(err));
                    });
                })
            }).catch(()=>{
                res.status(403).send({
                    status: 403,
                    data: {},
                    message: "User unauthorized"
                });
            })
        });
    })
    .get('/:id_utilisateur',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.isAdmin(token,(isAdmin)=>{
            isAdmin.then(()=>{
                models.utilisateur.findById(req.params.id_utilisateur).then(utilisateur=>{
                    if(utilisateur !== null){
                        res.status(200).send({
                            status:200,
                            data:{
                                utilisateur: utilisateur
                            },
                            message:""
                        })
                    }else{
                        res.status(404).send({
                            status:404,
                            data:{
                            },
                            message:""
                        })
                    }
                }).catch(err=>{
                    err.status = 422;
                    res.status(err.status).send(errorHandler(err));
                });
            }).catch(()=>{
                    //Je ne suis pas autorisé à visualiser le contenu
                    res.status(403).send({
                        status:403,
                        data:{},
                        message:"User unauthorized"
                    });
                })
            })
    })
        //Verifier qu'on est administrateur
    .delete('/:id_utilisateur',(req,res)=> {
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.isAdmin(token, (isAdmin) => {
            isAdmin.then((data) => {
                Token.decrypt(token).then((data) => {
                    if (data.id !== parseInt(req.params.id_utilisateur)) {
                        models.utilisateur.destroy({
                            where: {
                                id: req.params.id_utilisateur
                            }
                        }).then(nbUtilisateur => {
                            if (nbUtilisateur !== 0) {
                                res.status(200).send({
                                    status: 200,
                                    data: {
                                        deleted: true
                                    },
                                    message: ""
                                })
                            } else {
                                res.status(404).send({
                                    status: 404,
                                    data: {
                                        deleted: false
                                    },
                                    message: ""
                                })
                            }
                        })
                    }else{
                        res.status(405).send({
                            status:405,
                            data:{},
                            message:""
                        });
                    }
                })
            })
        })
    })
    .put('/:id_utilisateur',(req,res)=> {
        if(req.body.mdp){//Changer de mot de passe
            req.body.mdp = crypt.encrypt(req.body.mdp);//crypter le mot de passe avant de l'envoyer
        }
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.decrypt(token).then((data)=> {
            Token.isAdmin(token, (isAdmin) => {
                isAdmin.then(() => {
                    models.utilisateur.update(req.body, {
                        where: {
                            id: req.params.id_utilisateur
                        }
                    }).then((nbUpdated) => {
                        if (!isNaN(nbUpdated)) {
                            res.status(200).send({
                                status: 200,
                                data: {},
                                message: 'Utilisateur mis à jours'
                            })
                        } else {
                            res.status(404).send({
                                status: 404,
                                data: {},
                                message: 'Utilisateur non mis à jours'
                            })
                        }
                    }).catch((err) => {
                        err.status = 422;
                        res.status(err.status).send(errorHandler(err));
                    })
                    //Pas administrateur
                }).catch(()=>{
                    if(data.id === parseInt(req.params.id_utilisateur)){
                        models.utilisateur.update(req.body, {
                            where: {
                                id: req.params.id_utilisateur
                            }
                        }).then((nbUpdated) => {
                            if (!isNaN(nbUpdated)) {
                                res.status(200).send({
                                    status: 200,
                                    data: {},
                                    message: 'Utilisateur mis à jours'
                                })
                            } else {
                                res.status(404).send({
                                    status: 404,
                                    data: {},
                                    message: 'Utilisateur non mis à jours'
                                })
                            }
                        }).catch((err) => {
                            err.status = 422;
                            res.status(err.status).send(errorHandler(err));
                        })
                    }else{
                        //Je ne suis pas autorisé à visualiser le contenu
                        res.status(403).send({
                            status:403,
                            data:{},
                            message:"User unauthorized"
                        });
                    }
                })
            })
            })
        });

module.exports = router;
