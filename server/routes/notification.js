const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');
const Token  = require('../config/token');

router
    .get('/',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.decrypt(token).then((data)=>{
            models.notification.findAll({
                where:{
                    utilisateur_id:data.id,
                },attributes: ["id","partie_id","contenu"]
                ,include:{
                        model: models.partie,
                        attributes: ["nbr_participant","heure_prise","heure_rendu"],
                        include:{
                            model:models.terrain,
                            attributes: ["nom"]
                        }
                }
            }).then(notifications=>{
                res.status(200).send({
                    status:200,
                    data:{
                        notifications: notifications
                    },
                    message:""
                });
            }).catch(err=>{
                err.status = 422;
                res.status(err.status).send(errorHandler(err));
            });
        })
    })
    .delete('/:id_notification',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.decrypt(token).then((data)=> {
            models.notification.destroy({
                where: {
                    id: req.params.id_notification,
                    utilisateur_id: data.id
                }
            }).then(nbNotification => {
                if (nbNotification !== 0) {
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
            }).catch(err => {
                err.status = 422;
                res.status(err.status).send(errorHandler(err));
            });
        })
    })
    .get('/count',(req,res)=>{
        let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
        Token.decrypt(token).then((data)=> {
            models.notification.count({
                where: {
                    utilisateur_id: data.id
                }
            }).then(function(nb){
                res.status(200).send({
                    status: 200,
                    data: {
                        nb_notification: nb
                    },
                    message: ""
                })
            }).catch(function(err){
                err.status = 422;
                res.status(err.status).send(errorHandler(err));
            });
        })
    });


module.exports = router;
