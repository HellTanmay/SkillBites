import jwt from 'jsonwebtoken';
import AppError from '../utils/error.js';

export const Token=(user)=>{
    const Token=jwt.sign({username:user.username,id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'10m'});
    return  Token ;
}
export const refreshToken=(user)=>{
  const refresh=jwt.sign({username:user.username,id:user.id,role:user.role},process.env.JWT_REFRESH_SECRET,{expiresIn:'7d'});
  return  refresh ;
}


export const verifyToken=(req,res,next)=>{

    const {token}=req.cookies
    if(!token)
    throw new AppError('Unauthorized',401)
try {
    const data=jwt.verify(token,process.env.JWT_SECRET)
    if(data){
        req.user=data
        return next()
    }
} catch (err) {
   next(err)
}
}

export const verfiyRefreshToken=(req,res,next)=>{
    const refreshToken = req.cookies['refresh'];
    if (!refreshToken) {
      throw new AppError('Unauthorized', 401);
    }
      try {
      const data = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      if(data){
        req.user = data;
        return next();
      }
    } catch (err) {
      next(err)
    }
  };


