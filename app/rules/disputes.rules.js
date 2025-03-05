import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import { default_status, check_length_TEXT, default_delete_status } from '../config/config.js';

const DISPUTES = db.disputes;
const ORDERS = db.orders;
const Op = db.Sequelize.Op;

export const dispute_rules = {
    forFindingDispute: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return DISPUTES.findOne({
                    where: {
                        unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Dispute not found!');
                });
            })
    ],
    forFindingDisputeViaOrder: [
        check('order_unique_id', "Order Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((order_unique_id, { req }) => {
                return DISPUTES.findOne({
                    where: {
                        order_unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Dispute not found!');
                });
            })
    ],
    forFindingDisputeFalsy: [
        check('unique_id', "Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((unique_id, { req }) => {
                return DISPUTES.findOne({
                    where: {
                        unique_id,
                        status: default_delete_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Dispute not found!');
                });
            })
    ],
    forFindingDisputeViaOrderFalsy: [
        check('order_unique_id', "Order Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom((order_unique_id, { req }) => {
                return DISPUTES.findOne({
                    where: {
                        order_unique_id,
                        status: default_delete_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Dispute not found!');
                });
            })
    ],
    forFindingDisputeAlt: [
        check('dispute_unique_id', "Dispute Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom(dispute_unique_id => {
                return DISPUTES.findOne({ where: { unique_id: dispute_unique_id, status: default_status } }).then(data => {
                    if (!data) return Promise.reject('Dispute not found!');
                });
            })
    ],
    forAdding: [
        check('order_unique_id', "Order Unique Id is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .custom(order_unique_id => {
                return ORDERS.findOne({
                    where: {
                        unique_id: order_unique_id,
                        status: default_status
                    }
                }).then(data => {
                    if (!data) return Promise.reject('Order not found!');
                });
            }),
        check('message', "Message is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 1000 })
            .withMessage("Invalid length (3 - 1000) characters")
    ],
    forAddingViaRefunds: [
        check('message', "Message is required")
            .exists({ checkNull: true, checkFalsy: true })
            .bail()
            .isString().isLength({ min: 3, max: 930 })
            .withMessage("Invalid length (3 - 930) characters")
    ]
};  