const express = require('express');
const router = express.Router();
const errorHandler = require('../middlewares/errorHandler');
const models = require('../models');

router
    .get('/',(req,res)=>{
        models.sport.findAll().then(sports=>{
            res.status(200).send({
                status:200,
                data:{
                    sports: sports
                },
                message:""
            });
        }).catch(err=>{
            err.status = 422;
            res.status(err.status).send(errorHandler(err));
        });
});

module.exports = router;