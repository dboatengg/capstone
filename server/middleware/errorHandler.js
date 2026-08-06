import logger from '../utils/logger.js'


function errorHandler(err,req,res,next){


logger.error({

message:err.message,

stack:err.stack,

url:req.url,

method:req.method

})



if(err.name === "AppError"){

return res.status(err.statusCode).json({

error:err.message

})

}



res.status(500).json({

error:"Internal server error"

})


}


export default errorHandler;