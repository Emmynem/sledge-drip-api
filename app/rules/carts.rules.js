import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import { default_status, check_length_TEXT, default_delete_status } from '../config/config.js';

const CARTS = db.carts;
const PRODUCTS = db.products;
const Op = db.Sequelize.Op;

export const cart_rules = {
    forFindingCart: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return CARTS.findOne({
                    where: {
                        unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Cart not found!');
                });
            })
    ],
    forFindingCartFalsy: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return CARTS.findOne({
                    where: {
                        unique_id,
                        status: default_delete_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Cart not found!');
                });
            })
    ],
    forFindingCartAlt: [
        check('cart_unique_id', "Cart Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom(cart_unique_id => {
                return CARTS.findOne({ where: { unique_id: cart_unique_id, status: default_status } }).then(data => {
                    if (!data) return Promise.reject('Cart not found!');
                });
            })
    ],
    forAdding: [
        check('product_unique_id', "Product Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((product_unique_id, { req }) => {
                return PRODUCTS.findOne({ 
                    where: { 
                        unique_id: product_unique_id, 
                        status: default_status 
                    } 
                }).then(data => {
                    if (!data) return Promise.reject('Product not found!');
                });
            }),
        check('quantity', "Quantity is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isInt()
            .custom(quantity => {
                if (quantity === 0) return false;
                else if (quantity < 0) return false;
                else return true;
            })
            .withMessage("Quantity invalid"),
    ],
    forUpdatingQuantity: [
        check('quantity', "Quantity is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isInt()
            .custom(quantity => {
                if (quantity < 1) return false;
                else return true;
            })
            .withMessage("Quantity invalid")
    ],
};  