let models = require("../models");

models.sequelize.sync({force:true}).then(()=>{
    console.log('Database schemas recreated');
}).catch((err)=>{
    console.error(err);
});