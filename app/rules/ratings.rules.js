import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import { default_status, default_delete_status, validate_ratings, get_min_and_max_ratings } from '../config/config.js';

const USERS = db.users;
const RATINGS = db.ratings;
const RATING_IMAGES = db.rating_images;
const PRODUCTS = db.products;
const Op = db.Sequelize.Op;

export const rating_rules = {
	forFindingRating: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return RATINGS.findOne({
					where: {
						unique_id,
						status: default_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Rating not found!');
				});
			})
	],
	forFindingRatingFalsy: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return RATINGS.findOne({
					where: {
						unique_id,
						status: default_delete_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Rating not found!');
				});
			})
	],
	forFindingRatingAlt: [
		check('rating_unique_id', "Rating Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(rating_unique_id => {
				return RATINGS.findOne({ where: { unique_id: rating_unique_id, status: default_status } }).then(data => {
					if (!data) return Promise.reject('Rating not found!');
				});
			})
	],
	forFindingRatingImage: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return RATING_IMAGES.findOne({
					where: {
						unique_id,
						status: default_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Rating Image not found!');
				});
			})
	],
	forAddingAndUpdating: [
		check('rating', "Rating is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isInt()
			.custom(rating => !!validate_ratings(rating)).withMessage(`Invalid rating, accepts min = ${get_min_and_max_ratings().min}, max = ${get_min_and_max_ratings().max}`),
		check('description')
			.optional({ checkFalsy: false })
			.bail()
			.isLength({ min: 3, max: 3000 })
			.withMessage(`Invalid length (3 - ${3000}) characters`),
	], 
	forAddingMultipleRatingImages: [
		check('rating_images', "Rating Images are required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isArray({ min: 1 })
			.withMessage("Must be an array of objects of images uploaded (not empty)"),
	],
};  