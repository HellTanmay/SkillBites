import { Router } from 'express';
import { verifyToken } from "../Middleware/authMid.js";
import {createPayment, validatePayment, fetchOrders, getOrderDetails}from '../Controllers/PaymentController.js'

const router = Router();

router.post('/order/:id',verifyToken,createPayment)
        .post('/order/validate/:id',verifyToken,validatePayment)

router.get('/getOrders',verifyToken,fetchOrders)
        .get('/getInvoice',verifyToken,getOrderDetails)

export default router