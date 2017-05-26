const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');
const Token  = require('../config/token');
let NodeGeocoder = require('node-geocoder');
let options = {
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyBwH3x8fxDHp9vA6J7TtFNoZUqpWdVwoIY', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};
let geocoder = NodeGeocoder(options);

router
    .get('/:id_terrain',(req,res)=>{
        models.terrain.findById(req.params.id_terrain).then(terrain=>{
            if(terrain !== null){
                res.status(200).send({
                    status:200,
                    data:{
                        terrain: terrain
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
    })
    //Récupérer tous les terrains d'une ville par rapport aux coordonnées gps
    .get('',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        if(req.query.longitude && req.query.latitude) {
            geocoder.reverse({lat:req.query.latitude, lon:req.query.longitude})
                .then(function (localisation) {
                    let city=localisation[0].city;
                    req.body.localisation = {
                        type: 'Point',
                        coordinates: [req.query.longitude, req.query.latitude],
                        crs: {type: 'name', properties: {name: 'EPSG:4326'}}
                    };
                    models.ville.find({
                        where: {
                            nom: city
                        }
                    }).then((ville) => {
                        return ville.id;
                    }, (ville_id) => {
                        return ville_id;
                    }).then((ville_id) => {
                        //jointure
                        models.terrain.findAll(
                            {
                                include: [{
                                    model: models.ville,
                                    attributes: ["nom"],
                                    where:{
                                        id: ville_id
                                    }
                                },{
                                    model: models.sport,
                                    attributes: ["nom"]
                                }
                              ,{
                                model: models.partie,
                                where:{
                                  heure_rendu:{
                                    $gt: Date.now()
                                  }
                                },required: false
                              }]
                            }
                        ).then((terrains) => {
                            res.status(200).send({
                                status: 200,
                                data: terrains,//Transformer l'objet en json simple
                                message: ""
                            });
                        }).catch((err) => {
                            err.status = 422;
                            res.status(err.status).send(errorHandler(err));
                        })
                    })
                }).catch(function (err) {
                err.status = 400;
                res.status(err.status).send(errorHandler(err));
            });
        }else{
            res.status(404).send({
                status: 404,
                data: {},
                message: "Pas de terrain trouvé"
            });
        }
    })
    .delete('/:id_terrain',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.isAdmin(token,(isAdmin)=>{
            isAdmin.then(()=>{
                models.terrain.destroy({
                    where:{
                        id:req.params.id_terrain
                    }
                }).then(nbTerrain=>{
                    if(nbTerrain !== 0){
                        res.status(200).send({
                            status:200,
                            data:{
                                deleted: true
                            },
                            message:""
                        })
                    }else{
                        res.status(404).send({
                            status:404,
                            data:{
                                deleted: false
                            },
                            message:""
                        })
                    }
                }).catch(err=>{
                    err.status = 422;
                    res.status(err.status).send(errorHandler(err));
                });
            }).catch(()=> {
                res.status(403).send({
                    status: 403,
                    data: {},
                    message: "User unauthorized"
                });
            })
        });
    })
    .put('/:id_terrain',(req,res)=> {
        models.terrain.update(req.body, {
            where: {
                id: req.params.id_terrain
            }
        }).then((nbUpdated) => {
            if (!isNaN(nbUpdated)) {
                res.status(200).send({
                    status: 200,
                    data: {},
                    message: 'Terrain mis à jours'
                })
            } else {
                res.status(404).send({
                    status: 404,
                    data: {},
                    message: 'Terrain non mis à jours'
                })
            }
        }).catch((err) => {
            err.status = 422;
            res.status(err.status).send(errorHandler(err));
        })
    })
    .post('/',(req,res)=>{
        if(req.body.localisation && req.body.sport_id){
            geocoder.reverse({lat:req.body.localisation.latitude, lon:req.body.localisation.longitude})
                .then(function(localisation) {
                    req.body.localisation = {
                        type: 'Point',
                        coordinates: [req.body.localisation.longitude,req.body.localisation.latitude],
                        crs: { type: 'name', properties: { name: 'EPSG:4326'} }
                    };
                    let city = localisation[0].city;
                    //Si la ville n'existe pas on la crée et on récupére son id (sinon on récupére son id)
                    models.ville.findOrCreate({
                        where:{
                            nom: city
                        }
                    }).then((ville)=>{
                        return ville[0].id;
                    },(created_ville_id)=>{
                        return created_ville_id;
                    }).then((ville_id)=>{
                        req.body.ville_id = ville_id;
                        models.terrain.create(req.body).then((terrain) => {
                            res.status(201).send({
                                status: 201,
                                data: terrain,
                                message: ""
                            });
                        }).catch((err) => {
                            err.status = 422;
                            res.status(err.status).send(errorHandler(err));
                        })
                    })
                }).catch(function(err) {
                    err.status = 400;
                    res.status(err.status).send(errorHandler(err));
                });
        }else{
            res.status(422).send({
                status:422,
                data:{},
                message:"Form invalids data"
            })
        }
    });

module.exports = router;
