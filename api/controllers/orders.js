const mongoose = require('mongoose');


const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req,res,next) => { // 1
    Order.find()
    .select("product quantity _id")
    .populate('product','name')
    .exec()
    .then(docs => {                 //2
        res.status(200).json({      //3
            count: docs.length,
            orders: docs.map(doc =>{ //4
                return { //5
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {  //6
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    } //6
                } //5
            }) //4
        });  //3
    }) //2
}

exports.orders_create_order = (req,res,next)=>{ //1
    Product.findById(req.body.productId)
        .then(product => { //2
            if (!Product) {
                return res.status(404).json({
                    message: " Product not found"
                });
            }
            const order = new Order({  //3
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
        })       //3
        return order.save();
    })      //2
        .then(result => { //4
          console.log(result)
           res.status(201).json({ //5
              message: 'Order stored',
                 CreatedOrder: { //6
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
            }, //6
            request: { //7
                type: 'GET',
                url: 'http://localhost:3000/orders/' + result._id
            }//7
        }); //5
    })//4
        .catch(err =>{ //8
            console.log(err)
            res.status(500).json({ //9
                message: "product not found",
                error:err
            })   //9
    }); //8
}

exports.orders_get_order = (req,res,next)=>{
    Order
    .findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if (!order) {
            return res.status(404).json({
                message: " order not found"
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: "GET",
                url: 'http://localhost:3000/orders/'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
}

exports.orders_delete_order = (req,res,next)=>{
    Order.remove({ _id: req.params.orderID})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "order was deleted",
            request: {
                type: "POST",
                url: 'http://localhost:3000/orders/',
                body: {productId: 'ID', quantity: " Number"}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
}