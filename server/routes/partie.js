const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');
const Token = require('../config/token');

router
    .get('/',(req,res)=>{
      let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
      Token.decrypt(token).then((data)=>{
          models.partie.findAll({
              where:{
                  utilisateur_id:data.id,
              },include:{
                  model: models.terrain,
                  attributes:["nom","sport_id"],
                  include:{
                    model: models.sport,
                    attributes:["nom"]
                  }
                }
          }).then(parties=>{
              res.status(200).send({
                  status:200,
                  data:{
                      parties: parties
                  },
                  message:""
              });
          }).catch(err=>{
              err.status = 422;
              res.status(err.status).send(errorHandler(err));
          });
      })
    })
    .post('/',(req,res)=>{
        if((req.body.nbr_participant &&req.body.nbr_participant>0) && req.body.heure_prise && req.body.heure_rendu && (req.body.heure_prise < req.body.heure_rendu)&& req.body.terrain_id){
            let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
            Token.decrypt(token).then((data)=>{
                models.partie.create({
                    nbr_participant: req.body.nbr_participant,
                    terrain_id: req.body.terrain_id,
                    utilisateur_id: data.id,
                    heure_prise: req.body.heure_prise,
                    heure_rendu: req.body.heure_rendu,
                }).then((partie) => {
                        res.status(201).send({
                            status:201,
                            data:{
                                id: partie.partie_id,
                                heure_prise: partie.heure_prise,
                                heure_rendu: partie.heure_rendu
                            },
                            message: "Partie crée avec succès"
                        });
                    }).catch((err)=>{
                        err.status = 422;
                        err.message = "Erreur lors de l'insertion de la partie"
                        res.status(err.status).send(errorHandler(err));
                    })
            })
        }else{
            res.status(422).send({
                status:422,
                data:{},
                message:"Formulaire invalide"
            })
        }
    })
    .get('/:id_partie',(req,res)=>{
        models.partie.findById(req.params.id_partie).then((partie)=>{
            res.status(200).send({
                status:200,
                data:{
                    partie: partie
                },
                message:""
            });
        }).catch(err=> {
            err.status = 422;
            res.status(err.status).send(errorHandler(err));
        })
    })
    .put('/:id_partie',(req,res)=> {
        models.partie.update(req.body, {
            where: {
                id: req.params.id_partie
            }
        }).then((nbUpdated) => {
            if (!isNaN(nbUpdated)) {
                res.status(200).send({
                    status: 200,
                    data: {},
                    message: 'Partie mis à jours'
                })
            } else {
                res.status(404).send({
                    status: 404,
                    data: {},
                    message: 'Partie non mis à jours'
                })
            }
        }).catch((err) => {
            err.status = 422;
            res.status(err.status).send(errorHandler(err));
        })
    })
    .delete('/:id_partie',(req,res)=> {
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.isAdmin(token, (isAdmin) => {
            isAdmin.then((data) => {
                Token.decrypt(token).then((data) => {
                        models.partie.destroy({
                            where: {
                                id: req.params.id_partie
                            }
                          }).then(nbPartie => {
                              if (nbPartie !== 0) {
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
                })
            })
        })
    })

module.exports = router;
