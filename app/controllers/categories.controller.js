import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import {
	default_delete_status, default_status, true_status, false_status, paginate, tag_root, email_templates, return_all_letters_uppercase,
	random_numbers, anonymous, random_uuid, zero, strip_text, return_trimmed_data
} from '../config/config.js';
import db from "../models/index.js";
import { deleteImage } from '../middleware/uploads.js';

dotenv.config();

const { clouder_key, cloudy_name, cloudy_key, cloudy_secret } = process.env;

const CATEGORIES = db.categories;
const PRODUCTS = db.products;
const Op = db.Sequelize.Op;

export async function rootGetCategories(req, res) {
	const total_records = await CATEGORIES.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	CATEGORIES.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		distinct: true,
		// offset: pagination.start,
		// limit: pagination.limit
	}).then(categories => {
		if (!categories || categories.length === 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Categories Not found" }, []);
		} else {
			// SuccessResponse(res, { unique_id: tag_root, text: "Categories loaded" }, { ...categories, pages: pagination.pages });
			SuccessResponse(res, { unique_id: tag_root, text: "Categories loaded" }, { ...categories });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetCategory(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		CATEGORIES.findOne({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
		}).then(category => {
			if (!category) {
				NotFoundError(res, { unique_id: tag_root, text: "Category not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Category loaded" }, category);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootSearchCategories(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await CATEGORIES.count({
			where: {
				[Op.or]: [
					{
						reference: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					},
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

		CATEGORIES.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				[Op.or]: [
					{
						reference: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					},
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
		}).then(categories => {
			if (!categories || categories.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Categories Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: tag_root, text: "Categories loaded" }, { ...categories, pages: pagination.pages });
				SuccessResponse(res, { unique_id: tag_root, text: "Categories loaded" }, { ...categories });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetCategoriesSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await CATEGORIES.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		CATEGORIES.findAndCountAll({
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
		}).then(categories => {
			if (!categories || categories.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Categories Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: tag_root, text: "Categories loaded" }, { ...categories, pages: pagination.pages });
				SuccessResponse(res, { unique_id: tag_root, text: "Categories loaded" }, { ...categories });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function publicGetCategories(req, res) {
	const total_records = await CATEGORIES.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	CATEGORIES.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		// offset: pagination.start,
		// limit: pagination.limit
	}).then(categories => {
		if (!categories || categories.length === 0) {
			SuccessResponse(res, { unique_id: anonymous, text: "Categories Not found" }, []);
		} else {
			// SuccessResponse(res, { unique_id: anonymous, text: "Categories loaded" }, { ...categories, pages: pagination.pages });
			SuccessResponse(res, { unique_id: anonymous, text: "Categories loaded" }, { ...categories });
		}
	}).catch(err => {
		ServerError(res, { unique_id: anonymous, text: err.message }, null);
	});
};

export function publicGetCategory(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		CATEGORIES.findOne({
			attributes: { exclude: ['id', 'status'] },
			where: {
				...payload,
			},
		}).then(async category => {
			if (!category) {
				NotFoundError(res, { unique_id: anonymous, text: "Category not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Category loaded" }, category);
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function publicSearchCategories(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await CATEGORIES.count({
			where: {
				[Op.or]: [
					{
						reference: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					},
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

		CATEGORIES.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				[Op.or]: [
					{
						reference: {
							[Op.or]: {
								[Op.like]: `%${payload.search}`,
								[Op.startsWith]: `${payload.search}`,
								[Op.endsWith]: `${payload.search}`,
								[Op.substring]: `${payload.search}`,
							}
						},
					},
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
		}).then(categories => {
			if (!categories || categories.length === 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "Categories Not found" }, []);
			} else {
				// SuccessResponse(res, { unique_id: anonymous, text: "Categories loaded" }, { ...categories, pages: pagination.pages });
				SuccessResponse(res, { unique_id: anonymous, text: "Categories loaded" }, { ...categories });
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function addCategory(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const category_unique_id = uuidv4();
			const reference = random_uuid(4);

			await db.sequelize.transaction(async (transaction) => {
				const category = await CATEGORIES.create(
					{
						unique_id: category_unique_id,
						reference: reference,
						name: payload.name,
						stripped: strip_text(return_trimmed_data(payload.name)),
						image: payload.image ? payload.image : null,
						image_type: payload.image_type ? payload.image_type : null,
						image_public_id: payload.image_public_id ? payload.image_public_id : null,
						status: default_status
					}, { transaction }
				);

				if (category) {
					SuccessResponse(res, { unique_id: tag_root, text: "Category created successfully!" }, { unique_id: category_unique_id, reference: reference });
				} else {
					throw new Error("Error adding category");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateCategoryDetails(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const category = await CATEGORIES.update(
					{
						...payload,
						stripped: strip_text(return_trimmed_data(payload.name)),
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (category > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Category not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateCategoryImage(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const category_details = await CATEGORIES.findOne({
				where: {
					unique_id: payload.unique_id,
					status: default_status
				}
			});

			if (!category_details) {
				NotFoundError(res, { unique_id: tag_root, text: "Category not found" }, null);
			} else {
				await db.sequelize.transaction(async (transaction) => {
					const category = await CATEGORIES.update(
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
	
					if (category > 0) {
						SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
	
						// Delete former image available
						if (category_details.image_public_id !== null) {
							await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: category_details.image_public_id });
						}
					} else {
						throw new Error("Category not found");
					}
				});
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function deleteCategory(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const category_details = await CATEGORIES.findOne({
				where: {
					unique_id: payload.unique_id,
					status: default_status
				}
			});

			if (!category_details) {
				NotFoundError(res, { unique_id: tag_root, text: "Category not found" }, null);
			} else {
				const products = await PRODUCTS.findAll({
					attributes: ["unique_id"],
					where: {
						category_unique_id: payload.unique_id
					}
				});

				if (!products || products.length === 0) {
					await db.sequelize.transaction(async (transaction) => {
						const category = await CATEGORIES.destroy(
							{
								where: {
									unique_id: payload.unique_id,
									status: default_status
								},
								transaction
							}
						);

						if (category > 0) {
							OtherSuccessResponse(res, { unique_id: tag_root, text: "Category was deleted successfully!" });

							// Delete former image available
							if (category_details.image_public_id !== null) {
								await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: category_details.image_public_id });
							}
						} else {
							throw new Error("Error deleting category");
						}
					});
				} else {
					await db.sequelize.transaction(async (transaction) => {
						const product = await PRODUCTS.update(
							{
								category_unique_id: null,
							}, 
							{
								where: {
									category_unique_id: payload.unique_id,
									status: default_status
								},
								transaction
							}
						);

						const category = await CATEGORIES.destroy(
							{
								where: {
									unique_id: payload.unique_id,
									status: default_status
								},
								transaction
							}
						);

						if (category > 0) {
							OtherSuccessResponse(res, { unique_id: tag_root, text: "Category was deleted successfully!" });

							// Delete former image available
							if (category_details.image_public_id !== null) {
								await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: category_details.image_public_id });
							}
						} else {
							throw new Error("Error deleting category");
						}
					});
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};