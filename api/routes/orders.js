const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                products: docs.map((doc) => {
                    return {
                        quantity: doc.quantity,
                        productId: doc.productId,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:6969/orders/' + doc._id,
                        }
                    }
                })
            }
            console.log(docs);
            res.status(200).json(response);
        })
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    msg: 'Product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save()
        }).then((result) => {
            console.log(result);
            res.status(201).json({
                message: "Orders were created;",
                createdOrder: {
                    _id: result._id,
                    product: result.productId,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:6969/orders/' + result._id,
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: 'Product not dound!',
                err: err
            })
        });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then((order) => {
            if (!order) {
                return res.status(404).json({
                    msg: 'No order with this id',
                })
            }
            res.status(200).json({
                message: "Orders Details;",
                order: order
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            })
        });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "Orders deleted Details;",
                request: {
                    type: 'POST',
                    url: 'http://localhost:6969/orders/',
                    body: { poductId: 'ID', quantity: 'Number' }
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            })
        })
});

module.exports = router;