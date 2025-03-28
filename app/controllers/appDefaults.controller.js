import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, BadRequestError, logger } from '../common/index.js';
import {
	default_status, paginate, tag_root, return_all_letters_uppercase, anonymous, convert_app_default_name
} from '../config/config.js';
import db from "../models/index.js";

const APP_DEFAULTS = db.app_defaults;
const Op = db.Sequelize.Op;

export async function rootGetAppDefaults(req, res) {
	const total_records = await APP_DEFAULTS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	APP_DEFAULTS.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		distinct: true,
		// offset: pagination.start,
		// limit: pagination.limit
	}).then(app_defaults => {
		if (!app_defaults || app_defaults.length === 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "App Defaults Not found" }, []);
		} else {
			// SuccessResponse(res, { unique_id: tag_root, text: "App Defaults loaded" }, { ...app_defaults, pages: pagination.pages });
			SuccessResponse(res, { unique_id: tag_root, text: "App Defaults loaded" }, { ...app_defaults });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetAppDefault(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		APP_DEFAULTS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
		}).then(app_default => {
			if (!app_default) {
				NotFoundError(res, { unique_id: tag_root, text: "App Default not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "App Default loaded" }, app_default);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootSearchAppDefaults(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await APP_DEFAULTS.count({
			where: {
				[Op.or]: [
					{
						criteria: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					}
				]
			}
		});
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);

		APP_DEFAULTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				[Op.or]: [
					{
						criteria: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					}
				]
			},
			order: [
				['createdAt', 'DESC']
			],
			distinct: true,
			// offset: pagination.start,
			// limit: pagination.limit
		}).then(app_defaults => {
			if (!app_defaults || app_defaults.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "App Defaults Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: tag_root, text: "App Defaults loaded" }, { ...app_defaults, pages: pagination.pages });
				SuccessResponse(res, { unique_id: tag_root, text: "App Defaults loaded" }, { ...app_defaults });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetAppDefaultsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await APP_DEFAULTS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		APP_DEFAULTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
			order: [
				[orderBy, sortBy]
			],
			distinct: true,
			// offset: pagination.start,
			// limit: pagination.limit
		}).then(app_defaults => {
			if (!app_defaults || app_defaults.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "App Defaults Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: tag_root, text: "App Defaults loaded" }, { ...app_defaults, pages: pagination.pages });
				SuccessResponse(res, { unique_id: tag_root, text: "App Defaults loaded" }, { ...app_defaults });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export function publicGetAppDefault(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		APP_DEFAULTS.findOne({
			attributes: { exclude: ['id', 'status'] },
			where: {
				...payload,
			},
		}).then(async app_default => {
			if (!app_default) {
				NotFoundError(res, { unique_id: anonymous, text: "App Default not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "App Default loaded" }, app_default);
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function publicSearchAppDefaults(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await APP_DEFAULTS.count({
			where: {
				[Op.or]: [
					{
						criteria: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					}
				]
			}
		});
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);

		APP_DEFAULTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				[Op.or]: [
					{
						criteria: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					}
				]
			},
			order: [
				['createdAt', 'DESC']
			],
			// offset: pagination.start,
			// limit: pagination.limit
		}).then(app_defaults => {
			if (!app_defaults || app_defaults.length === 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "App Defaults Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: anonymous, text: "App Defaults loaded" }, { ...app_defaults, pages: pagination.pages });
				SuccessResponse(res, { unique_id: anonymous, text: "App Defaults loaded" }, { ...app_defaults });
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function addAppDefault(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const app_default = await APP_DEFAULTS.create(
					{
						unique_id: uuidv4(),
						criteria: convert_app_default_name(payload.criteria),
						data_type: payload.data_type,
						value: payload.data_type === "BOOLEAN" ? (payload.value === true || payload.value === 1 ? 1 : 0) : (
							payload.data_type === "STRING" || payload.data_type === "INTEGER" ? payload.value : JSON.stringify(payload.value)
						),
						status: default_status
					}, { transaction }
				);

				if (app_default) {
					SuccessResponse(res, { unique_id: tag_root, text: "App Default added successfully!" }, null);
				} else {
					throw new Error("Error adding app default");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateAppDefaultDetails(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const app_default = await APP_DEFAULTS.update(
					{
						criteria: convert_app_default_name(payload.criteria),
						data_type: payload.data_type,
						value: payload.data_type === "BOOLEAN" ? (payload.value === true || payload.value === 1 ? 1 : 0) : (
							payload.data_type === "STRING" || payload.data_type === "INTEGER" ? payload.value : JSON.stringify(payload.value)
						),
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (app_default > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Error updating details");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function deleteAppDefault(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const app_default = await APP_DEFAULTS.destroy(
					{
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (app_default > 0) {
					OtherSuccessResponse(res, { unique_id: tag_root, text: "App Default was deleted successfully!" });
				} else {
					throw new Error("Error deleting app default");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};