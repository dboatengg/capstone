import logger from '../utils/logger.js'

// Centralized error handler - logs errors and returns appropriate responses
function errorHandler(err,req,res,next){
  // Log error details
  logger.error({
    message:err.message,
    stack:err.stack,
    url:req.url,
    method:req.method
  })

  // Handle custom AppError
  if(err.name === "AppError"){
    return res.status(err.statusCode).json({
      error:err.message
    })
  }

  // Default to 500 for unexpected errors
  res.status(500).json({
    error:"Internal server error"
  })
}

export default errorHandler;