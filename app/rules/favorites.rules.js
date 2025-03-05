import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import { default_status, check_length_TEXT, default_delete_status } from '../config/config.js';

const FAVORITES = db.favorites;
const PRODUCTS = db.products;
const Op = db.Sequelize.Op;

export const favorite_rules = {
    forFindingFavorite: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return FAVORITES.findOne({
                    where: {
                        unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Favorite not found!');
                });
            })
    ],
    forFindingFavoriteFalsy: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return FAVORITES.findOne({
                    where: {
                        unique_id,
                        status: default_delete_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Favorite not found!');
                });
            })
    ],
    forFindingFavoriteAlt: [
        check('favorite_unique_id', "Favorite Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom(favorite_unique_id => {
                return FAVORITES.findOne({ where: { unique_id: favorite_unique_id, status: default_status } }).then(data => {
                    if (!data) return Promise.reject('Favorite not found!');
                });
            })
    ],
    forFindingFavoriteViaProductId: [
        check('product_unique_id', "Product Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((product_unique_id, { req }) => {
                return FAVORITES.findOne({
                    where: {
                        product_unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Favorite not found!');
                });
            })
    ],
    forAdding: [
        check('product_unique_id', "Product Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom(product_unique_id => {
                return PRODUCTS.findOne({ where: { unique_id: product_unique_id, status: default_status } }).then(data => {
                    if (!data) return Promise.reject('Product not found!');
                });
            }),
    ]
};  