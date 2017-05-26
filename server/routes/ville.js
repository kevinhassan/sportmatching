const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');
const Token = require('../config/token');

router
    .get('/',(req,res)=>{
        models.ville.findAll().then(villes=>{
            res.status(200).send({
                status:200,
                data:{
                    villes: villes
                },
                message:""
            });
        }).catch(err=>{
            err.status = 422;
            res.status(err.status).send(errorHandler(err));
        });
    })
    .get('/:id_ville/terrains',(req,res)=> {
        models.terrain.findAll({
            where: {
                ville_id: req.params.id_ville
            },include:{
                    model: models.sport,
                    attributes: ["nom"]
            },attributes: {
                exclude: ['sport_id','ville_id','localisation']
            }
        }).then((terrains) => {
            res.status(200).send({
                status: 200,
                data: {
                    terrains: terrains
                },
                message: ""
            });
        }).catch((err) => {
            err.status = 422;
            res.status(err.status).send(errorHandler(err));
        })
    })
    .get('/:id_ville/sports/:id_sport/parties',(req,res)=> {
        let id_terrains = [];
        models.terrain.findAll({
            where: {
                ville_id: req.params.id_ville,
                sport_id: req.params.id_sport
            }
        }).then((terrains) => {
            //Assembler les id des terrains concernés
            terrains.forEach((terrain) => {
                id_terrains.push(terrain.id);
            });
            return Promise.resolve(id_terrains);
        }).then((id_terrains) => {
            models.partie.findAll({
                where: {
                    terrain_id: id_terrains
                }
            }).then((parties => {
                res.status(200).send({
                    status: 200,
                    data: {
                        parties: parties
                    },
                    message: ""
                });
            }));
        }).catch((err) => {
            err.status = 422;
            res.status(err.status).send(errorHandler(err));
        })
    })
        //Verifier qu'on est administrateur
    .delete('/:id_ville',(req,res)=> {
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.isAdmin(token, (isAdmin) => {
            isAdmin.then(() => {
                models.ville.destroy({
                    where: {
                        id: req.params.id_ville
                    }
                }).then(nbVille => {
                    if (nbVille !== 0) {
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
                }).catch(()=>{
                    res.status(403).send({
                        status:403,
                        data:{},
                        message:"User unauthorized"
                    });
                })
            })
        })
});

module.exports = router;
