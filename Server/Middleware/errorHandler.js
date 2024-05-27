

export const ErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Something went wrong';
    if (err.name === 'ValidationError') {
       const errors= Object.values(err.errors).map(val=>val.message)
       err.message=  `${errors}`
       
    }
    if(err.code===11000){
        const name=err.keyValue.email;
        err.message=`User with email ${name} already exists!`
    }
       
    res.status(err.statusCode).json({ success: false, 
                                      message:err.message,
                                      stackTrace:err.stack,
                                      error:err});
  }
