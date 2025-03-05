import { check } from 'express-validator';
import moment from 'moment';
import db from "../models/index.js";
import {
	default_status, check_length_TEXT, strip_text, return_default_value, validate_future_date, validate_future_end_date, default_delete_status
} from '../config/config.js';

const NEWSLETTER = db.newsletter;
const APP_DEFAULTS = db.app_defaults;
const Op = db.Sequelize.Op;

export const newsletter_rules = {
	forFindingNewsletterInternal: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return NEWSLETTER.findOne({
					where: {
						unique_id
					}
				}).then(data => {
					if (!data) return Promise.reject('Newsletter not found!');
				});
			})
	],
	forFindingNewsletter: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return NEWSLETTER.findOne({
					where: {
						unique_id,
						status: default_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Newsletter not found!');
				});
			})
	],
	forFindingNewsletterFalsy: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom((unique_id, { req }) => {
				return NEWSLETTER.findOne({
					where: {
						unique_id,
						status: default_delete_status
					}
				}).then(data => {
					if (!data) return Promise.reject('Newsletter not found!');
				});
			})
	],
	forFindingNewsletterAlt: [
		check('newsletter_unique_id', "Newsletter Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(newsletter_unique_id => {
				return NEWSLETTER.findOne({ where: { unique_id: newsletter_unique_id, status: default_status } }).then(data => {
					if (!data) return Promise.reject('Newsletter not found!');
				});
			})
	],
	forAdding: [
		check('email', "Email is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isEmail()
			.withMessage('Invalid email format')
			.bail()
			.custom(email => {
				return NEWSLETTER.findOne({ where: { email } }).then(data => {
					if (data) return Promise.reject('Email already exists!');
				});
			}),
	],
	forUpdatingSubscription: [
		check('email', "Email is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isEmail()
			.withMessage('Invalid email format'),
		check('subscription', "Subscription is required")
			.exists({ checkNull: true, checkFalsy: false })
			.bail()
			.isBoolean()
			.withMessage("Value should be true or false"),
	],
};  