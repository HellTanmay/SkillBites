const {sign,verify}=require('jsonwebtoken');
const AppError = require('./error');
const secret = "ddii-hdij-dknn-cbch-5544-3se7";

const Token=(user)=>{
    const Token=sign({username:user.username,id:user.id,role:user.role},secret);
    return Token;
}

const verifyToken=(req,res,next)=>{
    const token=req.cookies['token']

    if(!token)
    throw new AppError('Unauthorized',400)
try {
    const data=verify(token,secret)
    if(data){
        req.auth=true
        req.user=data
        return next()
    }
} catch (err) {
   next(err)
}
}

module.exports={Token,verifyToken}
