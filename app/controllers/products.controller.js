import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, CreationSuccessResponse, BadRequestError, logger } from '../common/index.js';
import {
	default_delete_status, default_status, true_status, false_status, paginate, tag_root, email_templates, return_all_letters_uppercase,
	random_numbers, anonymous, zero, strip_text, return_bulk_product_images_array
} from '../config/config.js';
import db from "../models/index.js";
import { deleteImage } from '../middleware/uploads.js';

dotenv.config();

const { clouder_key, cloudy_name, cloudy_key, cloudy_secret } = process.env;

const PRODUCTS = db.products;
const PRODUCT_IMAGES = db.product_images;
const CATEGORIES = db.categories;
const RATINGS = db.ratings;
const RATING_IMAGES = db.rating_images;
const Op = db.Sequelize.Op;

export async function rootGetProducts(req, res) {
	const total_records = await PRODUCTS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	PRODUCTS.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: CATEGORIES,
				attributes: ['unique_id', 'name', 'image', 'stripped']
			},
			{
				model: PRODUCT_IMAGES,
			},
			{
				model: RATINGS,
				attributes: ['unique_id', 'rating', 'description'], 
				include: [
					{
						model: RATING_IMAGES,
						attributes: ['unique_id', 'image']
					},
				]
			},
		], 
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(products => {
		if (!products || products.length === 0) {
			SuccessResponse(res, { unique_id: tag_root, text: "Products Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: tag_root, text: "Products loaded" }, { ...products, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: tag_root, text: err.message }, null);
	});
};

export function rootGetProduct(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		PRODUCTS.findOne({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
			include: [
				{
					model: CATEGORIES,
					attributes: ['unique_id', 'name', 'image', 'stripped']
				},
				{
					model: PRODUCT_IMAGES,
				},
				{
					model: RATINGS,
					attributes: ['unique_id', 'rating', 'description'],
					include: [
						{
							model: RATING_IMAGES,
							attributes: ['unique_id', 'image']
						},
					]
				},
			], 
		}).then(product => {
			if (!product) {
				NotFoundError(res, { unique_id: tag_root, text: "Product not found" }, null);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Product loaded" }, product);
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootSearchProducts(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PRODUCTS.count({
			where: {
				[Op.or]: [
					{
						specification: {
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

		PRODUCTS.findAndCountAll({
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
					}, 
					{
						specification: {
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
			include: [
				{
					model: CATEGORIES,
					attributes: ['unique_id', 'name', 'image', 'stripped']
				},
				{
					model: PRODUCT_IMAGES,
				},
				{
					model: RATINGS,
					attributes: ['unique_id', 'rating', 'description'],
					include: [
						{
							model: RATING_IMAGES,
							attributes: ['unique_id', 'image']
						},
					]
				},
			], 
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(products => {
			if (!products || products.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Products Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Products loaded" }, { ...products, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function rootGetProductsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PRODUCTS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		PRODUCTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: CATEGORIES,
					attributes: ['unique_id', 'name', 'image', 'stripped']
				},
				{
					model: PRODUCT_IMAGES,
				},
				{
					model: RATINGS,
					attributes: ['unique_id', 'rating', 'description'],
					include: [
						{
							model: RATING_IMAGES,
							attributes: ['unique_id', 'image']
						},
					]
				},
			], 
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(products => {
			if (!products || products.length === 0) {
				SuccessResponse(res, { unique_id: tag_root, text: "Products Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: tag_root, text: "Products loaded" }, { ...products, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		});
	}
};

export async function publicGetProducts(req, res) {
	const total_records = await PRODUCTS.count();
	const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
	const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
	const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

	PRODUCTS.findAndCountAll({
		attributes: { exclude: ['id'] },
		order: [
			[orderBy, sortBy]
		],
		include: [
			{
				model: CATEGORIES,
				attributes: ['unique_id', 'name', 'image', 'stripped']
			},
			{
				model: PRODUCT_IMAGES,
				attributes: ['image']
			},
			// {
			// 	model: RATINGS,
			// 	attributes: ['rating', 'description'],
			// 	include: [
			// 		{
			// 			model: RATING_IMAGES,
			// 			attributes: ['image']
			// 		},
			// 	]
			// },
		], 
		distinct: true,
		offset: pagination.start,
		limit: pagination.limit
	}).then(products => {
		if (!products || products.length === 0) {
			SuccessResponse(res, { unique_id: anonymous, text: "Products Not found" }, []);
		} else {
			SuccessResponse(res, { unique_id: anonymous, text: "Products loaded" }, { ...products, pages: pagination.pages });
		}
	}).catch(err => {
		ServerError(res, { unique_id: anonymous, text: err.message }, null);
	});
};

export function publicGetProduct(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		PRODUCTS.findOne({
			attributes: { exclude: ['id', 'status'] },
			where: {
				...payload,
			},
			include: [
				{
					model: CATEGORIES,
					attributes: ['unique_id', 'name', 'image', 'stripped']
				},
				{
					model: PRODUCT_IMAGES,
					attributes: ['image']
				},
				// {
				// 	model: RATINGS,
				// 	attributes: ['rating', 'description'],
				// 	include: [
				// 		{
				// 			model: RATING_IMAGES,
				// 			attributes: ['image']
				// 		},
				// 	]
				// },
			], 
		}).then(async product => {
			if (!product) {
				NotFoundError(res, { unique_id: anonymous, text: "Product not found" }, null);
			} else {
				const product_view_update = await PRODUCTS.increment({ views: 1, favorites: 2 }, { where: { ...payload } });
				const total_ratings_via_rating = await RATINGS.findAll({
					attributes: ["rating", [db.sequelize.fn('count', db.sequelize.col('id')), 'total_count']],
					where: {
						product_unique_id: product.unique_id
					},
					group: "rating"
				});

				// Use this when ready ... 
				// SuccessResponse(res, { unique_id: anonymous, text: "Product loaded" }, { product, total_ratings_via_rating });
				SuccessResponse(res, { unique_id: anonymous, text: "Product loaded" }, product);
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function publicSearchProducts(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PRODUCTS.count({
			where: {
				[Op.or]: [
					{
						specification: {
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
			distinct: true,
		});
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);

		PRODUCTS.findAndCountAll({
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
					},
					{
						specification: {
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
			include: [
				{
					model: CATEGORIES,
					attributes: ['unique_id', 'name', 'image', 'stripped']
				},
				{
					model: PRODUCT_IMAGES,
					attributes: ['image']
				},
				// {
				// 	model: RATINGS,
				// 	attributes: ['rating', 'description'],
				// 	include: [
				// 		{
				// 			model: RATING_IMAGES,
				// 			attributes: ['image']
				// 		},
				// 	]
				// },
			], 
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(products => {
			if (!products || products.length === 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "Products Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Products loaded" }, { ...products, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function publicGetProductsSpecifically(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
	} else {
		const total_records = await PRODUCTS.count({ where: { ...payload } });
		const pagination = paginate(parseInt(req.query.page) || parseInt(req.body.page), parseInt(req.query.size) || parseInt(req.body.size), total_records);
		const orderBy = req.query.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(req.query.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		PRODUCTS.findAndCountAll({
			attributes: { exclude: ['id'] },
			where: {
				...payload
			},
			order: [
				[orderBy, sortBy]
			],
			include: [
				{
					model: CATEGORIES,
					attributes: ['unique_id', 'name', 'image', 'stripped']
				},
				{
					model: PRODUCT_IMAGES,
					attributes: ['image']
				},
				// {
				// 	model: RATINGS,
				// 	attributes: ['rating', 'description'],
				// 	include: [
				// 		{
				// 			model: RATING_IMAGES,
				// 			attributes: ['image']
				// 		},
				// 	]
				// },
			],
			distinct: true,
			offset: pagination.start,
			limit: pagination.limit
		}).then(products => {
			if (!products || products.length === 0) {
				SuccessResponse(res, { unique_id: anonymous, text: "Products Not found" }, []);
			} else {
				SuccessResponse(res, { unique_id: anonymous, text: "Products loaded" }, { ...products, pages: pagination.pages });
			}
		}).catch(err => {
			ServerError(res, { unique_id: anonymous, text: err.message }, null);
		});
	}
};

export async function addProduct(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const product_unique_id = uuidv4();

			await db.sequelize.transaction(async (transaction) => {
				const product = await PRODUCTS.create(
					{
						unique_id: product_unique_id,
						...payload,
						stripped: strip_text(payload.name),
						remaining: payload.remaining ? payload.remaining : payload.quantity,
						sales_price: payload.sales_price ? payload.sales_price : zero,
						views: zero,
						favorites: zero,
						status: default_status
					}, { transaction }
				);

				if (product) {
					SuccessResponse(res, { unique_id: tag_root, text: "Product created successfully!" }, { unique_id: product_unique_id, });
				} else {
					throw new Error("Error adding product");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateProductName(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const product = await PRODUCTS.update(
					{
						...payload,
						stripped: strip_text(payload.name),
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (product > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Product not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateProductDetails(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const product = await PRODUCTS.update(
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

				if (product > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Product not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateProductStock(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const product = await PRODUCTS.update(
					{
						...payload,
						remaining: payload.remaining ? payload.remaining : payload.quantity,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (product > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Product not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function updateProductPrices(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const product = await PRODUCTS.update(
					{
						...payload,
						sales_price: payload.sales_price ? payload.sales_price : zero,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (product > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Product not found");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function uploadProductImages(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			await db.sequelize.transaction(async (transaction) => {
				const product_images = await PRODUCT_IMAGES.bulkCreate(return_bulk_product_images_array(payload.product_images, { product_unique_id: payload.product_unique_id }), { transaction });

				if (product_images.length > 0) {
					SuccessResponse(res, { unique_id: tag_root, text: "Product images created successfully!" });
				} else {
					throw new Error("Error adding product images");
				}
			});
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function deleteProductImage(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const product_image_details = await PRODUCT_IMAGES.findOne({
				where: {
					unique_id: payload.unique_id,
					status: default_status
				}
			});

			if (!product_image_details) {
				NotFoundError(res, { unique_id: tag_root, text: "Product Image not found" }, null);
			} else {
				await db.sequelize.transaction(async (transaction) => {
					const product_image = await PRODUCT_IMAGES.destroy(
						{
							where: {
								unique_id: payload.unique_id,
								status: default_status
							},
							transaction
						}
					);

					if (product_image > 0) {
						OtherSuccessResponse(res, { unique_id: tag_root, text: "Product Image was deleted successfully!" });

						// Delete former image available
						if (product_image_details.image_public_id !== null) {
							await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: product_image_details.image_public_id });
						}
					} else {
						throw new Error("Error deleting product image");
					}
				});
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};

export async function deleteProduct(req, res) {
	const errors = validationResult(req);
	const payload = matchedData(req);

	if (!errors.isEmpty()) {
		ValidationError(res, { unique_id: tag_root, text: "Validation Error Occured" }, errors.array())
	} else {
		try {
			const product_details = await PRODUCTS.findOne({
				where: {
					unique_id: payload.unique_id,
					status: default_status
				}
			});

			if (!product_details) {
				NotFoundError(res, { unique_id: tag_root, text: "Product not found" }, null);
			} else {
				const product_images = await PRODUCT_IMAGES.findAll({
					where: {
						product_unique_id: payload.unique_id
					}
				});

				if (!product_images || product_images.length === 0) {
					await db.sequelize.transaction(async (transaction) => {
						const product = await PRODUCTS.destroy(
							{
								where: {
									unique_id: payload.unique_id,
									status: default_status
								},
								transaction
							}
						);

						if (product > 0) {
							OtherSuccessResponse(res, { unique_id: tag_root, text: "Product was deleted successfully!" });
						} else {
							throw new Error("Error deleting product");
						}
					});
				} else {
					await db.sequelize.transaction(async (transaction) => {
						for (let index = 0; index < product_images.length; index++) {
							const product_image_element = product_images[index];

							// Delete former file available
							if (product_image_element.image_public_id !== null) {
								await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: product_image_element.image_public_id });
							}

							if (index === product_images.length - 1) {
								const product_image = await PRODUCT_IMAGES.destroy(
									{
										where: {
											product_unique_id: payload.unique_id
										},
										transaction
									}
								);
							}
						}

						const product = await PRODUCTS.destroy(
							{
								where: {
									unique_id: payload.unique_id,
									status: default_status
								},
								transaction
							}
						);

						if (product > 0) {
							OtherSuccessResponse(res, { unique_id: tag_root, text: "Product was deleted successfully!" });
						} else {
							throw new Error("Error deleting product");
						}
					});
				}
			}
		} catch (err) {
			ServerError(res, { unique_id: tag_root, text: err.message }, null);
		}
	}
};