import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import {
	default_delete_status, default_status, true_status, false_status, paginate, tag_root, return_all_letters_uppercase, anonymous 
} from '../config/config.js';
import db from "../models/index.js";
import { deleteImage } from '../middleware/uploads.js';

dotenv.config();

const { clouder_key, cloudy_name, cloudy_key, cloudy_secret } = process.env;

const BANNERS = db.banners;
const Op = db.Sequelize.Op;

export async function rootGetBanners(req, res) {
	const total_records = await BANNERS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	BANNERS.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		distinct: true,
		// offset: pagination.start,
		// limit: pagination.limit
	}).then(banners => {
		if (!banners || banners.length === 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Banners Not found" }, []);
		} else {
			// SuccessResponse(res, { unique_id: tag_root, text: "Banners loaded" }, { ...banners, pages: pagination.pages });
			SuccessResponse(res, { unique_id: tag_root, text: "Banners loaded" }, { ...banners });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetBanner(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		BANNERS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
		}).then(banner => {
			if (!banner) {
				NotFoundError(res, { unique_id: tag_root, text: "Banner not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Banner loaded" }, banner);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootSearchBanners(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await BANNERS.count({
			where: {
				[Op.or]: [
					{
						name: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}
				]
			}
		});
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);

		BANNERS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				[Op.or]: [
					{
						name: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}
				]
			},
			order: [
				['createdAt', 'DESC']
			],
			distinct: true,
			// offset: pagination.start,
			// limit: pagination.limit
		}).then(banners => {
			if (!banners || banners.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Banners Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: tag_root, text: "Banners loaded" }, { ...banners, pages: pagination.pages });
				SuccessResponse(res, { unique_id: tag_root, text: "Banners loaded" }, { ...banners });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetBannersSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await BANNERS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		BANNERS.findAndCountAll({
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
		}).then(banners => {
			if (!banners || banners.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Banners Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: tag_root, text: "Banners loaded" }, { ...banners, pages: pagination.pages });
				SuccessResponse(res, { unique_id: tag_root, text: "Banners loaded" }, { ...banners });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function publicGetBanners(req, res) {
	const total_records = await BANNERS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	BANNERS.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		// offset: pagination.start,
		// limit: pagination.limit
	}).then(banners => {
		if (!banners || banners.length === 0) {
			SuccessResponse(res, { unique_id: anonymous, text: "Banners Not found" }, []);
		} else {
			// SuccessResponse(res, { unique_id: anonymous, text: "Banners loaded" }, { ...banners, pages: pagination.pages });
			SuccessResponse(res, { unique_id: anonymous, text: "Banners loaded" }, { ...banners });
		}
	}).catch(err => {
		ServerError(res, { unique_id: anonymous, text: err.message }, null);
	});
};

export function publicGetBanner(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		BANNERS.findOne({
			attributes: { exclude: ['id', 'status'] },
			where: {
				...payload,
			},
		}).then(async banner => {
			if (!banner) {
				NotFoundError(res, { unique_id: anonymous, text: "Banner not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Banner loaded" }, banner);
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function publicSearchBanners(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await BANNERS.count({
			where: {
				[Op.or]: [
					{
						name: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}
				]
			}
		});
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);

		BANNERS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				[Op.or]: [
					{
						name: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						}
					}
				]
			},
			order: [
				['createdAt', 'DESC']
			],
			// offset: pagination.start,
			// limit: pagination.limit
		}).then(banners => {
			if (!banners || banners.length === 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "Banners Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: anonymous, text: "Banners loaded" }, { ...banners, pages: pagination.pages });
				SuccessResponse(res, { unique_id: anonymous, text: "Banners loaded" }, { ...banners });
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function addBanner(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const banner_unique_id = uuidv4();

			await db.sequelize.transaction(async (transaction) => {
				const banner = await BANNERS.create(
					{
						unique_id: banner_unique_id,
						name: payload.name,
						link: payload.link,
						image: payload.image ? payload.image : null,
						image_type: payload.image_type ? payload.image_type : null,
						image_public_id: payload.image_public_id ? payload.image_public_id : null,
						status: default_status
					}, { transaction }
				);

				if (banner) {
					SuccessResponse(res, { unique_id: tag_root, text: "Banner created successfully!" }, { unique_id: banner_unique_id });
				} else {
					throw new Error("Error adding banner");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateBannerDetails(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const banner = await BANNERS.update(
					{
						...payload,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (banner > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Banner not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateBannerImage(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const banner_details = await BANNERS.findOne({
				where: {
					unique_id: payload.unique_id,
					status: default_status
				}
			});

			if (!banner_details) {
				NotFoundError(res, { unique_id: tag_root, text: "Banner not found" }, null);
			} else {
				await db.sequelize.transaction(async (transaction) => {
					const banner = await BANNERS.update(
						{
							...payload,
						}, {
							where: {
								unique_id: payload.unique_id,
								status: default_status
							},
							transaction
						}
					);

					if (banner > 0) {
						SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);

						// Delete former image available
						if (banner_details.image_public_id !== null) {
							await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: banner_details.image_public_id });
						}
					} else {
						throw new Error("Banner not found");
					}
				});
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function deleteBanner(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const banner_details = await BANNERS.findOne({
				where: {
					unique_id: payload.unique_id,
					status: default_status
				}
			});

			if (!banner_details) {
				NotFoundError(res, { unique_id: tag_root, text: "Banner not found" }, null);
			} else {
				await db.sequelize.transaction(async (transaction) => {
					const banner = await BANNERS.destroy(
						{
							where: {
								unique_id: payload.unique_id,
								status: default_status
							},
							transaction
						}
					);

					if (banner > 0) {
						OtherSuccessResponse(res, { unique_id: tag_root, text: "Banner was deleted successfully!" });

						// Delete former image available
						if (banner_details.image_public_id !== null) {
							await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: banner_details.image_public_id });
						}
					} else {
						throw new Error("Error deleting banner");
					}
				});
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};