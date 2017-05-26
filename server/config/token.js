// sign with default (HMAC SHA256)
let jwt = require('jsonwebtoken');
let secret = require('./secretkey.json').key;
let duree = 3600*24*1000; //1j de validité en ms
let models = require('../models/');

exports.encrypt = (data)=>{
    data.expiresIn = new Date().getTime()+duree;//1j
    return Promise.resolve(jwt.sign(data, secret,{ algorithm: 'HS512'}));
};
exports.decrypt = (token)=>{
    return Promise.resolve(jwt.verify(token, secret,{ algorithm: 'HS512',clockTimestamp: Date.now()}));
};
exports.isExpired = (token)=>{
    return this.decrypt(token).then((data)=> {
        if(data.expiresIn< new Date().getTime()){
            return Promise.resolve(true);
        }else{
            return Promise.reject(false);
        }
    });
};
exports.isAdmin = (token,callback)=>{
    this.decrypt(token).then((data)=> {
        models.utilisateur.findById(data.id).then((utilisateur)=>{
            utilisateur.est_admin?callback(Promise.resolve()):callback(Promise.reject());
        })
    });
};