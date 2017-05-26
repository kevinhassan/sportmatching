const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');
const Token  = require('../config/token');

router
    .post('/',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        if((req.body.nbr_personne && req.body.nbr_personne>0) && (req.body.distance_max&&req.body.distance_max > 0) && req.body.localisation && req.body.sport_id){
            Token.decrypt(token).then((data)=> {
                req.body.utilisateur_id = data.id;
                req.body.date = Date.now();
                req.body.localisation = {
                    type: 'Point',
                    coordinates: [req.query.longitude, req.query.latitude],
                    crs: {type: 'name', properties: {name: 'EPSG:4326'}}
                };
                models.attendre.create(req.body).then((attente) => {
                    res.status(201).send({
                        status: 201,
                        data: attente,
                        message: "Attente ajoutée avec succès"
                    });
                }).catch((err) => {
                    err.status = 422;
                    err.message= "L'ajout a échoué";
                    res.status(err.status).send(errorHandler(err));
                })
            });
        }else{
            res.status(422).send({
                status:422,
                data:{},
                message:"Données du formulaire invalides"
            })
        }
    })
    .get('/',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.decrypt(token).then((data)=>{
            models.attendre.findAll({
                where:{
                    utilisateur_id:data.id,
                },attributes: ["distance_max","nbr_personne","date"]
                ,include:{
                        model: models.sport,
                        attributes:["nom","id"]
                }
            }).then(attentes=>{
                res.status(200).send({
                    status:200,
                    data:{
                        attentes: attentes
                    },
                    message:""
                });
            }).catch(err=>{
                err.status = 422;
                res.status(err.status).send(errorHandler(err));
            });
        })
    })
    .delete('/:sport_id',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        if(req.params.sport_id){
            Token.decrypt(token).then((data)=> {
                models.attendre.destroy({
                    where: {
                        utilisateur_id: data.id,
                        sport_id: req.params.sport_id
                    }
                }).then(nbAttente => {
                    if (nbAttente !== 0) {
                        res.status(200).send({
                            status: 200,
                            data: {
                                deleted: true
                            },
                            message: "Suppression Effectuée"
                        })
                    } else {
                        res.status(404).send({
                            status: 404,
                            data: {
                                deleted: false
                            },
                            message: "Impossible de trouver l'attente"
                        })
                    }
                }).catch(err => {
                    err.status = 422;
                    err.message = "Erreur lors de la suppression";
                    res.status(err.status).send(errorHandler(err));
                });
            })
        }else{
            res.status(401).send({
                status: 401,
                data: {
                    deleted: false
                },
                message: "Formulaire invalide"
            })
        }
    });



module.exports = router;
