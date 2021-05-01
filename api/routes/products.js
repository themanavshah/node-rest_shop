const { json } = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = function (req, file, cb) {
    //reject a file
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

const Product = require("../models/product");

router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get("/:productId", ProductsController.products_get_byId);

router.patch("/:productId", checkAuth, ProductsController.products_patch_product);

router.delete("/:productId", checkAuth, ProductsController.products_delete_product);

module.exports = router;