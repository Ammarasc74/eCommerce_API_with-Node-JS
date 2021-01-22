const express = require('express');
const { route } = require('./products');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');


const Order = require('../models/order');
const Product = require('../models/product');
const { request } = require('express');


const OrdersController = require('../controllers/orders');

// Handling routes 
router.get("/", checkAuth, OrdersController.orders_get_all); //1

router.post("/",checkAuth , OrdersController.orders_create_order); //1

router.get("/:orderId",checkAuth , OrdersController.orders_get_order);

router.delete("/:orderID",checkAuth , OrdersController.orders_delete_order);

module.exports = router;