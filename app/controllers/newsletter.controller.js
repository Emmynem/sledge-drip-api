import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, BadRequestError, logger } from '../common/index.js';
import {
	false_status, true_status, tag_root, paginate, timestamp_str_alt, anonymous, default_status, return_all_letters_uppercase,
} from '../config/config.js';
import db from "../models/index.js";

const NEWSLETTER = db.newsletter;
const Op = db.Sequelize.Op;

export async function rootGetNewsletters(req, res) {
	const total_records = await NEWSLETTER.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	NEWSLETTER.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		offset: pagination.start,
		limit: pagination.limit
	}).then(newsletter => {
		if (!newsletter || newsletter.length == 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Newsletter Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Newsletter loaded" }, { ...newsletter, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetNewsletter(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		NEWSLETTER.findOne({
			attributes: { exclude: ['id'] },
			where: {
				unique_id: payload.unique_id,
			},
		}).then(newsletter => {
			if (!newsletter) {
				NotFoundError(res, { unique_id: tag_root, text: "Newsletter not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Newsletter loaded" }, newsletter);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function addNewsletterEmail(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const newsletter = await NEWSLETTER.create(
					{
						unique_id: uuidv4(),
						email: payload.email,
						subscription: true_status, 
						status: default_status
					}, { transaction }
				);

				if (newsletter) {
					SuccessResponse(res, { unique_id: anonymous, text: "Newsletter added successfully!" });
				} else {
					throw new Error("Error adding newsletter");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};

export async function updateNewsletterSubscription(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const newsletter = await NEWSLETTER.update(
					{
						subscription: payload.subscription ? payload.subscription : false_status, 
					}, {
						where: {
							email: payload.email,
							status: default_status
						},
						transaction
					}
				);

				if (newsletter > 0) {
					SuccessResponse(res, { unique_id: anonymous, text: "Subscription updated successfully!" }, null);
				} else {
					throw new Error("Newsletter email not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}
};