import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import { default_status, check_length_TEXT, default_delete_status, strip_text, validate_product_specification } from '../config/config.js';

const PRODUCTS = db.products;
const PRODUCT_IMAGES = db.product_images;
const CATEGORIES = db.categories;
const Op = db.Sequelize.Op;

export const product_rules = {
    forFindingProduct: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return PRODUCTS.findOne({
                    where: {
                        unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Product not found!');
                });
            })
    ],
    forFindingProductFalsy: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return PRODUCTS.findOne({
                    where: {
                        unique_id,
                        status: default_delete_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Product not found!');
                });
            })
    ],
    forFindingProductAlt: [
        check('product_unique_id', "Product Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom(product_unique_id => {
                return PRODUCTS.findOne({ where: { unique_id: product_unique_id, status: default_status } }).then(data => {
                    if (!data) return Promise.reject('Product not found!');
                });
            })
    ],
    forFindingProductImage: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return PRODUCT_IMAGES.findOne({
                    where: {
                        unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Product Image not found!');
                });
            })
    ],
    forAdding: [
        check('category_unique_id', "Category Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((category_unique_id, { req }) => {
                return CATEGORIES.findOne({
                    where: {
                        unique_id: category_unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Category not found!');
                });
            }),
        check('name', "Name is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 200 })
            .withMessage("Invalid length (3 - 200) characters")
            .bail()
            .custom((name, { req }) => {
                return PRODUCTS.findOne({ 
                    where: { 
                        stripped: strip_text(name), 
                        category_unique_id: req.query.category_unique_id || req.body.category_unique_id || '',
                        status: default_status 
                    } 
                }).then(data => {
                    if (data) return Promise.reject('Product already exists!');
                });
            }),
        check('description', "Description is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isLength({ min: 3, max: check_length_TEXT })
            .withMessage(`Invalid length (3 - ${check_length_TEXT}) characters`),
        check('specification', "Specification is required")
            .exists({ checkNull: true, checkFalsy: false }),
            // .bail()
            // .custom(specification => !!validate_product_specification(specification))
            // .withMessage(`Invalid specification value`),
        check('quantity', "Quantity is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isInt()
            .custom(quantity => {
                if (quantity < 1) return false;
                else return true;
            })
            .withMessage("Quantity invalid"),
        check('max_quantity', "Max Quantity is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isInt()
            .custom(max_quantity => {
                if (max_quantity < 1) return false;
                else return true;
            })
            .withMessage("Max Quantity invalid"),
        check('remaining')
            .optional({ checkFalsy: false })
            .bail()
            .isInt()
            .custom(remaining => {
                if (remaining < 1) return false;
                else return true;
            })
            .withMessage("Remaining invalid"),
        check('price', "Price is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isFloat()
            .custom(price => {
                if (price === 0) return false;
                else if (price < 1) return false;
                else return true;
            })
            .withMessage("Price invalid"),
        check('sales_price')
            .optional({ checkFalsy: false })
            .bail()
            .isFloat()
            .custom(sales_price => {
                if (sales_price === 0) return false;
                else if (sales_price < 1) return false;
                else return true;
            })
            .withMessage("Sales Price invalid")
    ],
    forUpdatingName: [
        check('name', "Name is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 200 })
            .withMessage("Invalid length (3 - 200) characters")
            .bail()
            .custom((name, { req }) => {
                return PRODUCTS.findOne({
                    where: {
                        stripped: strip_text(name),
                        unique_id: {
                            [Op.ne]: req.query.unique_id || req.body.unique_id || '',
                        },
                        category_unique_id: req.query.category_unique_id || req.body.category_unique_id || '',
                        status: default_status
                    }
                }).then(data => {
                    if (data) return Promise.reject('Product already exists!');
                });
            })
    ],  
    forUpdatingDescription: [
        check('description', "Description is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isLength({ min: 3, max: check_length_TEXT })
            .withMessage(`Invalid length (3 - ${check_length_TEXT}) characters`)
    ],
    forUpdatingSpecification: [
        check('specification', "Specification is required")
            .exists({ checkNull: true, checkFalsy: false })
            // .bail()
            // .custom(specification => !!validate_product_specification(specification))
            // .withMessage(`Invalid specification value`)
    ],
    forUpdatingStock: [
        check('quantity', "Quantity is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isInt()
            .custom(quantity => {
                if (quantity < 1) return false;
                else return true;
            })
            .withMessage("Quantity invalid"),
        check('max_quantity', "Max Quantity is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isInt()
            .custom(max_quantity => {
                if (max_quantity < 1) return false;
                else return true;
            })
            .withMessage("Max Quantity invalid"),
        check('remaining')
            .optional({ checkFalsy: false })
            .bail()
            .isInt()
            .custom(remaining => {
                if (remaining < 1) return false;
                else return true;
            })
            .withMessage("Remaining invalid")
    ],
    forUpdatingPrices: [
        check('price', "Price is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isFloat()
            .custom(price => {
                if (price === 0) return false;
                else if (price < 0) return false;
                else return true;
            })
            .withMessage("Price invalid"),
        check('sales_price')
            .optional({ checkFalsy: false })
            .bail()
            .isFloat()
            .custom(sales_price => {
                if (sales_price === 0) return false;
                else if (sales_price < 0) return false;
                else return true;
            })
            .withMessage("Sales Price invalid")
    ],
    forUpdatingCategory: [
        check('category_unique_id', "Category Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((category_unique_id, { req }) => {
                return CATEGORIES.findOne({
                    where: {
                        unique_id: category_unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Category not found!');
                });
            })
    ],
    forSearching: [
        check('search', "Search is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 2, max: 200 })
            .withMessage("Invalid length (2 - 200) characters"),
    ], 
    forAddingProductImage: [
        check('image', "Image is required")
            .exists({ checkNull: true, checkFalsy: true }),
        check('image_type', "Image Type is required")
            .exists({ checkNull: true, checkFalsy: true }),
        check('image_public_id', "Image Public Id is required")
            .exists({ checkNull: true, checkFalsy: true }),
    ], 
    forAddingMultipleProductImages: [
        check('product_images', "Product Images are required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isArray({ min: 1 })
            .withMessage("Must be an array of objects of images uploaded (not empty)"), 
    ], 
    forFindingViaStripped: [
        check('stripped', "Stripped is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 200 })
            .withMessage("Invalid length (3 - 200) characters")
            .bail()
            .custom((stripped, { req }) => {
                return PRODUCTS.findOne({
                    where: {
                        stripped: stripped,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Product not found!');
                });
            }),
    ]
};  