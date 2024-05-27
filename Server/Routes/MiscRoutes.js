import { Router } from "express";
import { AddContact, CreateCategory, DeleteCategory, GetCategories, GetContacts, certificate, statistics, studentPerformances } from '../Controllers/MiscController.js'
import { verifyToken } from "../Middleware/authMid.js";

const router=Router()

router.post('/addCategories',verifyToken,CreateCategory)
        .post('/contact',AddContact)
        .post('/certificate/:id',verifyToken,certificate)

router.get('/getCategories',verifyToken,GetCategories)
        .get('/getContacts',verifyToken,GetContacts)
        .get('/stats',verifyToken,statistics)
        .get('/performanceStats/:id',verifyToken,studentPerformances)

router.delete('/deleteCategory',verifyToken,DeleteCategory)

export default router