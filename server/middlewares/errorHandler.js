let errorHander = function(err){
    return {status:err.status,data:{},message:err.message};
};

module.exports = errorHander;