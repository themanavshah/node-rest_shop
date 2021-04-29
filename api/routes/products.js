const { json } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Product = require("../models/product");

router.get("/", (req, res, next) => {
    Product.find()
        .select('name place _id')
        .exec()
        .then((docs) => {
            const response = {
                count: docs.length,
                products: docs.map((doc) => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:6969/products/' + doc._id,
                        }
                    }
                })
            }
            console.log(docs);
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    // res.status(200).json({
    //     message: "Hnadling GET req. to /products."
    // });
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Hnadling POST req. to /products.",
                createProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:6969/products/' + result._id,
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
    // res.status(200).json({
    //     message: "Hnadling POST req. to /products.",
    //     createProduct: product
    // });
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then((doc) => {
            console.log(doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:6969/products/' + product._id,
                    }

                });
            } else {
                res.status(404).json({
                    message: "No entry found"
                })
            }
            // res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: "You DISOVERD speciqal id;",
    //         id: id,
    //     });
    // } else {
    //     res.status(200).json({
    //         message: "NormAL Id;"
    //     });
    // }
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateMany({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "patched!",
                request: {
                    type: 'GET',
                    url: 'http://localhost:6969/products/' + id,
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    // res.status(200).json({
    //     message: "Updated product;"
    // });
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "product deletd!",
                request: {
                    type: 'POST',
                    url: 'http://localhost:6969/products/',
                    body: { ame: 'String', price: "Number" }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

    // res.status(200).json({
    //     message: "Deleted product;"
    // });
});

module.exports = router;