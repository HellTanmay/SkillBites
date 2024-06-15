import { Router } from 'express'
import {Logout, editProfile, getAllUser, login, profile, register, resend_otp, userProfile, verify, verifyEmail} from '../Controllers/UserController.js'
import { verifyToken } from '../Middleware/authMid.js'
import { uploadImageVideo } from '../Middleware/multer.js'

const router=Router()


router.post('/Signup',register)
        .post('/verifyEmail',verifyEmail)
        .post('/resend-otp',resend_otp)
        .post('/Login',login)
        .post('/logout',Logout)

router.get('/verify',verifyToken,verify)
        .get('/profile',verifyToken,profile)
        .get('/userProfile',verifyToken,userProfile)
        .get('/fetchAllUsers',verifyToken,getAllUser)
 router.put('/profile/edit',verifyToken,uploadImageVideo.single('avatar'),editProfile)

export default router

 // const { originalname, path } = req.file;
        // const parts = originalname.split(".");
        // const ext = parts[parts.length - 1];
        // const newPath = path + "." + ext;
        // fs.renameSync(path, newPath);