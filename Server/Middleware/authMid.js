import jwt from 'jsonwebtoken';
import AppError from '../utils/error.js';
const secret = "ddii-hdij-dknn-cbch-5544-3se7";

export const Token=(user)=>{
    const Token=jwt.sign({username:user.username,id:user.id,role:user.role},secret);
    return Token;
}

export const verifyToken=(req,res,next)=>{
    const token=req.cookies['token']

    if(!token)
    throw new AppError('Unauthorized',400)
try {
    const data=jwt.verify(token,secret)
    if(data){
        req.auth=true
        req.user=data
        return next()
    }
} catch (err) {
   next(err)
}
}


