import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import {
	default_status, check_length_TEXT, strip_text, return_default_value, validate_future_date, validate_future_end_date, default_delete_status
} from '../config/config.js';

const BANNERS = db.banners;
const APP_DEFAULTS = db.app_defaults;
const Op = db.Sequelize.Op;

export const banners_rules = {
	forFindingBannerInternal: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return BANNERS.findOne({
					where: {
						unique_id
					}
				}).then(data => {
					if (!data) return Promise.reject('Banner not found!');
				});
			})
	],
	forFindingBanner: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return BANNERS.findOne({
					where: {
						unique_id,
						status: default_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Banner not found!');
				});
			})
	],
	forFindingBannerFalsy: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return BANNERS.findOne({
					where: {
						unique_id,
						status: default_delete_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Banner not found!');
				});
			})
	],
	forFindingBannerAlt: [
		check('banner_unique_id', "Banner Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(banner_unique_id => {
				return BANNERS.findOne({ where: { unique_id: banner_unique_id, status: default_status } }).then(data => {
					if (!data) return Promise.reject('Banner not found!');
				});
			})
	],
	forAdding: [
		check('name', "Name is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 500 })
			.withMessage("Invalid length (3 - 500) characters"),
		check('link', "Link is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isURL()
			.withMessage("Value must be a specified url"),
		check('image', "Image is required")
			.exists({ checkNull: true, checkFalsy: true }),
		check('image_type', "Image Type is required")
			.exists({ checkNull: true, checkFalsy: true }),
		check('image_public_id', "Image Public Id is required")
			.exists({ checkNull: true, checkFalsy: true }),
	],
	forUpdatingDetails: [
		check('name', "Name is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 3, max: 500 })
			.withMessage("Invalid length (3 - 500) characters"),
		check('link', "Link is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isURL()
			.withMessage("Value must be a specified url"),
	],
	forUpdatingImage: [
		check('image', "Image is required")
			.exists({ checkNull: true, checkFalsy: true }),
		check('image_type', "Image Type is required")
			.exists({ checkNull: true, checkFalsy: true }),
		check('image_public_id', "Image Public Id is required")
			.exists({ checkNull: true, checkFalsy: true }),
	],
};  