let Token = require('../config/token');
let models = require('../models');

module.exports = function(req,res,next){
    //verifier que l'utilisateur existe et que son token est bon
    let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        Token.decrypt(token).then((data)=>{
            models.utilisateur.findById(data.id).then((utilisateur)=>{
                if(!utilisateur){
                    res.status(403).send({
                        status: 403,
                        data: {},
                        message: "User not found"
                    })
                }
            })
        });
        Token.isExpired(token).then(()=>{
                res.status(400).send({
                    status: 400,
                    data: {},
                    message: "Token expired"
                });
        }).catch(()=>{
            next();
        });
        return;
    }else {
        res.status(400).send({
            status: 400,
            data: {},
            message: "Missing token"
        });
        return;
    }
    next();
};


