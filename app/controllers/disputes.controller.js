import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import { default_delete_status, default_status, tag_root, true_status, false_status, paginate, return_all_letters_uppercase } from '../config/config.js';
import db from "../models/index.js";

const DISPUTES = db.disputes;
const USERS = db.users;
const ORDERS = db.orders;
const CATEGORIES = db.categories;
const PRODUCTS = db.products;
const PRODUCT_IMAGES = db.product_images;
const Op = db.Sequelize.Op;

export async function rootGetDisputes(req, res) {
	const total_records = await DISPUTES.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	DISPUTES.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: USERS,
				attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
			},
			{
				model: ORDERS,
				attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							}, 
							{
								model: CATEGORIES,
								attributes: ['name', 'image', 'stripped']
							}, 
						]
					},
				]
			}
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(disputes => {
		if (!disputes || disputes.length == 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Disputes Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Disputes loaded" }, { ...disputes, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetDispute(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		DISPUTES.findOne({
			attributes: { exclude: ['id'] },
			where: {
				unique_id: payload.unique_id,
			},
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
				},
				{
					model: ORDERS,
					attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
							include: [
								{
									model: PRODUCT_IMAGES,
									attributes: ['image']
								}, 
								{
									model: CATEGORIES,
									attributes: ['name', 'image', 'stripped']
								}, 
							]
						},
					]
				}
			]
		}).then(dispute => {
			if (!dispute) {
				NotFoundError(res, { unique_id: tag_root, text: "Dispute not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Dispute loaded" }, dispute);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetDisputesSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await DISPUTES.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		DISPUTES.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: USERS,
					attributes: ['unique_id', 'firstname', 'middlename', 'lastname', 'email', 'phone_number', 'address', 'country', 'state', 'city', 'profile_image']
				},
				{
					model: ORDERS,
					attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
							include: [
								{
									model: PRODUCT_IMAGES,
									attributes: ['image']
								}, 
								{
									model: CATEGORIES,
									attributes: ['name', 'image', 'stripped']
								}, 
							]
						},
					]
				}
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(disputes => {
			if (!disputes || disputes.length == 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Disputes Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Disputes loaded" }, { ...disputes, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function getDisputes(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const total_records = await DISPUTES.count({ where: { user_unique_id } });
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	DISPUTES.findAndCountAll({
		attributes: { exclude: ['id', 'user_unique_id', 'createdAt', 'updatedAt'] },
		where: {
			user_unique_id
		},
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: ORDERS,
				attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
				include: [
					{
						model: PRODUCTS,
						attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
						include: [
							{
								model: PRODUCT_IMAGES,
								attributes: ['image']
							}, 
							{
								model: CATEGORIES,
								attributes: ['name', 'image', 'stripped']
							}, 
						]
					},
				]
			}
		],
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(disputes => {
		if (!disputes || disputes.length == 0) {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Disputes Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: user_unique_id, text: "Disputes loaded" }, { ...disputes, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
	});
};

export async function getDisputesSpecifically(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;

	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await DISPUTES.count({ where: { user_unique_id, ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		DISPUTES.findAndCountAll({
			attributes: { exclude: ['id', 'user_unique_id', 'createdAt', 'updatedAt'] },
			where: {
				user_unique_id,
				...payload,
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: ORDERS,
					attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
							include: [
								{
									model: PRODUCT_IMAGES,
									attributes: ['image']
								}, 
								{
									model: CATEGORIES,
									attributes: ['name', 'image', 'stripped']
								}, 
							]
						},
					]
				}
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(disputes => {
			if (!disputes || disputes.length == 0) {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Disputes Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Disputes loaded" }, { ...disputes, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};

export function getDispute(req, res) {
	const user_unique_id = req.USER_UNIQUE_ID;
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: user_unique_id, text: "Validation Error Occured" }, errors.array())
	} else {
		DISPUTES.findOne({
			attributes: { exclude: ['id'] },
			where: {
				user_unique_id,
				...payload,
			},
			include: [
				{
					model: ORDERS,
					attributes: ['unique_id', 'tracking_number', 'contact_fullname', 'contact_email', 'shipping_firstname', 'shipping_lastname', 'shipping_address', 'shipping_state', 'shipping_city', 'shipping_zip_code', 'billing_firstname', 'billing_lastname', 'billing_address', 'billing_state', 'billing_city', 'billing_zip_code', 'quantity', 'amount', 'shipping_fee', 'gateway', 'payment_method', 'paid', 'shipped', 'disputed', 'delivery_status', 'createdAt', 'updatedAt'],
					include: [
						{
							model: PRODUCTS,
							attributes: ['name', 'stripped', 'specification', 'quantity', 'remaining', 'max_quantity', 'price', 'sales_price', 'views', 'favorites'],
							include: [
								{
									model: PRODUCT_IMAGES,
									attributes: ['image']
								}, 
								{
									model: CATEGORIES,
									attributes: ['name', 'image', 'stripped']
								}, 
							]
						}
					]
				}
			]
		}).then(dispute => {
			if (!dispute) {
				NotFoundError(res, { unique_id: user_unique_id, text: "Dispute not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: user_unique_id, text: "Dispute loaded" }, dispute);
			}
		}).catch(err => {
			ServerError(res, { unique_id: user_unique_id, text: err.message }, null);
		});
	}
};