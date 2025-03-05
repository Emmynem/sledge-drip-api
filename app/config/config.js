import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const primary_domain = "https://example.com";
export const admin_domain = "https://commerce.q-ctrls.com";
export const mailer_url = "https://api.mailer.xnyder.com";
export const clouder_url = "https://api.clouder.xnyder.com";
export const coinbase_payment_url = "https://api.commerce.coinbase.com/charges";
export const coinbase_version = "2018-03-22";
export const paystack_verify_payment_url = "https://api.paystack.co/transaction/verify/";
export const squad_sandbox_verify_payment_url = "https://sandbox-api-d.squadco.com/transaction/verify/";
export const squad_live_verify_payment_url = "https://api-d.squadco.com/transaction/verify/";
export const google_distance_matrix_url = "https://maps.googleapis.com/maps/api/distancematrix/json?";
export const google_geocoding_url = "https://maps.googleapis.com/maps/api/geocode/json?";
export const default_path = "sledgedrip";

// Password options
export const password_options = {
	minLength: 8,
	maxLength: 30,
	minLowercase: 1,
	minNumbers: 1,
	minSymbols: 1,
	minUppercase: 1
};

// Email Templates 
export const email_templates = {
	user_changed_password: "user-changed-password",
	user_reset_password: "user-reset-password",
	user_2fa_otp_login: "user-2fa-otp-login",
	user_otp: "user-otp",
	user_email_verification: "user-email-verification",
	user_welcome_with_password: "user-welcome-with-password",
	user_reset_pin: "user-reset-pin",
	user_complete_deposit: "user-complete-deposit",
	user_complete_withdrawal: "user-complete-withdrawal",
	user_cancelled_deposit: "user-cancelled-deposit",
	user_cancelled_withdrawal: "user-cancelled-withdrawal",
	user_order_processing: "user-order-processing",
	user_order_paid: "user-order-paid",
	user_orders_cancelled: "user-orders-cancelled",
	user_order_cancelled: "user-order-cancelled",
	user_order_in_transit: "user-order-in-transit",
	user_order_shipped: "user-order-shipped",
	user_order_received: "user-order-received",
	user_order_completed: "user-order-completed",
	user_order_refund_dispute: "user-order-refund-dispute",
	accept_user_order_refund_dispute: "accept-user-order-refund-dispute",
	deny_user_order_refund_dispute: "deny-user-order-refund-dispute",
};

export const tag_root = "Root";
export const anonymous = "Anonymous";
export const db_start = "sledgedrip_";
export const db_end = "_tbl";

export const sledgedrip_header_key = "sledgedrip-access-key";
export const sledgedrip_header_token = "sledgedrip-access-token";

// API Key
export const tag_internal_api_key = "Internal";
export const tag_external_api_key = "External";
// End - API Key

export const false_status = false;
export const true_status = true;

export const verified_status = true;
export const unverified_status = false;

export const default_status = 1;
export const default_delete_status = 0;
export const default_pending_status = 2;

export const cart_checked_out = 2;
export const max_product_price_shipping = 2500;

export const dummy_product_image = "https://res.cloudinary.com/hydraxpress/image/upload/v1714846885/branding/nf02tjngtryzqndy3ota.jpg";

export const zero = 0;

// App Defaults 
export const app_defaults = {
	api_whitelist: "Api_Whitelist",
	paystack_public_key: "Paystack_Public_Key",
	paystack_secret_key: "Paystack_Secret_Key",
	squad_public_key: "Squad_Public_Key",
	squad_secret_key: "Squad_Secret_Key",
	paypal_link: "Paypal_Link",
	bnb_wallet_address: "Bnb_Wallet_Address",
	btc_wallet_address: "Btc_Wallet_Address",
	eth_wallet_address: "Eth_Wallet_Address",
	sol_wallet_address: "Sol_Wallet_Address",
	tron_wallet_address: "Tron_Wallet_Address",
	coinbase_api_key: "Coinbase_Api_Key",
	coinbase_webhook_secret_key: "Coinbase_Webhook_Secret_Key",
	minimum_shipping_fee: "Minimum_Shipping_Fee",
	users_emails: "Users_Emails",
	users_phone_numbers: "Users_Phone_Numbers",
	maintenance: "Maintenance"
};

export const default_app_values = [
	{
		unique_id: uuidv4(),
		criteria: "Maintenance",
		data_type: "BOOLEAN",
		value: false,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Paystack_Secret_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Paystack_Public_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Squad_Secret_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Squad_Public_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Paypal_Link",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Bnb_Wallet_Address",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Btc_Wallet_Address",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Eth_Wallet_Address",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Sol_Wallet_Address",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Tron_Wallet_Address",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Coinbase_Api_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Coinbase_Secret_Key",
		data_type: "STRING",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Minimum_Shipping_Fee",
		data_type: "INTEGER",
		value: 10,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Users_Emails",
		data_type: "ARRAY",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Users_Phone_Numbers",
		data_type: "ARRAY",
		value: null,
		status: 1
	},
	{
		unique_id: uuidv4(),
		criteria: "Api_Whitelist",
		data_type: "ARRAY",
		value: null,
		status: 1
	}
];
// End - App Defaults

export const check_length_TINYTEXT = 255;
export const check_length_TEXT = 65535;
export const check_length_MEDIUMTEXT = 16777215;
export const check_length_LONGTEXT = 4294967295;

// Default Actions
export const completed = "Completed";
export const processing = "Processing";
export const cancelled = "Cancelled";
export const refunded = "Refunded";
export const pending = "Pending";
export const payment_methods = {
	card: "Credit/Debit Card",
	wallet: "Wallet",
	transfer: "Transfer", 
	paypal: "Paypal",
	crypto: "Crypto"
};
export const gateways = {
	paystack: "PAYSTACK",
	squad: "SQUAD",
	paypal: "PAYPAL",
	coinbase: "COINBASE",
	wallets: "WALLETS",
	internal: "INTERNAL"
};
export const ratings = [
	{
		rate: "Very Bad",
		value: 1
	},
	{
		rate: "Bad",
		value: 2
	},
	{
		rate: "Ok",
		value: 3
	},
	{
		rate: "Good",
		value: 4
	},
	{
		rate: "Very Good",
		value: 5
	}
];
// End - Default Actions

// Default Transaction Types
export const withdrawal = "Withdrawal";
export const deposit = "Deposit";
export const refund = "Refund";
export const payment = "Payment";
export const reversal = "Reversal";
export const transfer = "Transfer";
export const subscription = "Subscription";
export const charges = "Charges";
export const shipped = "Shipped";
export const received = "Received";
export const shipping = "Shipping";
export const disputed = "Disputed";
export const refund_denied = "Refund Denied";
export const checked_out = "Checked Out";
export const paid = "Paid";
export const transaction_types = { paid, withdrawal, deposit, refund, payment, reversal, transfer, subscription, charges };
// End - Default Transaction Types

// Default Currency
export const currency = "USD"; // USD - Dollar
// End - Default Currency

export const app_defaults_data_type = ['STRING', 'INTEGER', 'BIGINT', 'BOOLEAN'];
export const paginate_limit = 20;

// File lengths
export const file_length_5Mb = 5000000;
export const file_length_10Mb = 10000000;
export const file_length_15Mb = 15000000;
export const file_length_20Mb = 20000000;
export const file_length_25Mb = 25000000;
export const file_length_30Mb = 30000000;
export const file_length_35Mb = 35000000;
export const file_length_40Mb = 40000000;
export const file_length_45Mb = 45000000;
export const file_length_50Mb = 50000000;
export const file_length_55Mb = 55000000;
export const file_length_60Mb = 60000000;
export const file_length_65Mb = 65000000;
export const file_length_70Mb = 70000000;
export const file_length_75Mb = 75000000;
export const file_length_80Mb = 80000000;
export const file_length_85Mb = 85000000;
export const file_length_90Mb = 90000000;
export const file_length_95Mb = 95000000;
export const file_length_100Mb = 100000000;

// Accesses
export const access_granted = 1;
export const access_suspended = 2;
export const access_revoked = 3;
export const all_access = [access_granted, access_suspended, access_revoked];
// End - Accesses

export const today_str = () => {
	const d = new Date();
	const date_str = d.getFullYear() + "-" + ((d.getUTCMonth() + 1) < 10 ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	return date_str;
};

export const todays_date = () => {
	const d = new Date();
	return d.toDateString();
};

export const year_str = () => {
	const d = new Date();
	const date_str = d.getFullYear();
	return date_str;
};

export const timestamp_str = (date) => {
	const d = new Date(date * 1000);
	return {
		fulldate: d.toDateString() + " at " + d.toLocaleTimeString(),
		date: d.toDateString(),
		time: d.toLocaleTimeString(),
	};
};

export const timestamp_str_alt = (date) => {
	const d = new Date(date);
	const date_ = d.getFullYear() + "-" + ((d.getUTCMonth() + 1) < 10 ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	const time_ = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ":" + (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
	return date_ + " " + time_;
};

export const time_zero_hundred = () => {
	const d = new Date();
	const time_str = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + "00";
	return time_str;
};

export const random_uuid = (length) => {
	if (length === undefined || length === null || length === 0) {
		let values = crypto.randomBytes(20).toString('hex');
		return values;
	} else {
		let values = crypto.randomBytes(length).toString('hex');
		return values;
	}
};

export const random_numbers = (length) => {
	if (length === undefined || length === null || length === 0) {
		return 0;
	} else {
		let rand_number = "";
		for (let index = 0; index < length; index++) {
			rand_number += Math.floor(Math.random() * 10);
		}
		return rand_number;
	}
};

export const test_all_regex = (data, regex) => {
	if (!data) {
		return false;
	}

	const valid = regex.test(data);
	if (!valid) {
		return false;
	}

	return true;
};

export const digit_filter = (digits) => {
	return digits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const strip_text = (text) => {
	//Lower case everything
	let string = text.toLowerCase();
	//Make alphanumeric (removes all other characters)
	string = string.replace(/[^a-z0-9_\s-]/g, "");
	//Clean up multiple dashes or whitespaces
	string = string.replace(/[\s-]+/g, " ");
	//Convert whitespaces and underscore to dash
	string = string.replace(/[\s_]/g, "-");
	return string;
};

export const unstrip_text = (text) => {
	let string = text.replace(/[-_]/g, " ");
	return string;
};

export const unstrip_text_alt = (text) => {
	let string = text.replace(/[-_]/g, "");
	return string;
};

export const filterBytes = (bytes) => {
	if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
	var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
		number = Math.floor(Math.log(bytes) / Math.log(1024));
	return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
};

export const sanitize_address = (text) => {
	// Lower case everything
	let string = text.toUpperCase();
	// Hashes encoded
	string = string.replace(/[#]/g, "%23");
	// Plus sign encoded
	string = string.replace(/[+]/g, "%2B");
	// Make alphanumeric (removes all other characters)
	string = string.replace(/[,]/g, "");
	// Clean up multiple dashes or whitespaces
	string = string.replace(/[\s-]+/g, " ");
	// Convert whitespaces and underscore to dash
	string = string.replace(/[\s_]/g, "%20");
	return string;
};

export const sanitize_addresses = (address_arr) => {
	let address_txt = "";
	address_arr.forEach((element, index) => {
		if (index !== address_arr.length - 1) {
			address_txt = address_txt.concat(sanitize_address(element) + "%7C");
		} else {
			address_txt = address_txt.concat(sanitize_address(element));
		}
	});
	return address_txt;
};

export const price_without_kobos = (price) => {
	const price_txt = price.toString();

	if (price < 99) {
		return parseInt(price_txt.charAt(0) + "0");
	} else if (price < 999) {
		return parseInt(price_txt.charAt(0) + "00");
	} else if (price < 9999) {
		return parseInt(price_txt.charAt(0) + price_txt.charAt(1) + "00");
	} else if (price < 99999) {
		return parseInt(price_txt.charAt(0) + price_txt.charAt(1) + price_txt.charAt(2) + "00");
	} else {
		return parseInt(price_txt.charAt(0) + price_txt.charAt(1) + price_txt.charAt(2) + price_txt.charAt(3) + "00");
	}
};

export const calculate_distance_price = (distance_pricing, real_time_distance) => {
	const distance_text = real_time_distance.distance.text;
	const distance_value = real_time_distance.distance.value;

	const duration_text = real_time_distance.duration.text;
	const duration_value = real_time_distance.duration.value;
	const mins_duration = duration_value / 60;

	const first_price = distance_value / distance_pricing.denominator;
	const second_price = first_price + distance_pricing.base_price;

	const max_time_even = Math.floor(mins_duration / distance_pricing.max_time_mins);
	const third_price = mins_duration > distance_pricing.max_time_mins ? second_price + (distance_pricing.max_time_mins * max_time_even) : second_price;

	return {
		duration: duration_text,
		distance: distance_text,
		price: price_without_kobos(Math.ceil(third_price, 0))
	}
};

export const strip_text_underscore = (text) => {
	string = text.replace(/[\s]/g, "_");
	return string;
};

export const return_first_letter_uppercase = (str) => {
	return str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};

export const return_first_letter_uppercase_alt = (_str) => {
	const str = unstrip_text(_str);
	return str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};

export const return_all_letters_uppercase = (str) => {
	return str ? str.toUpperCase() : str;
};

export const return_all_letters_lowercase = (str) => {
	return str ? str.toLowerCase() : str;
};

export const return_trimmed_data = (str) => {
	return str.trim();
};

export const return_sort_by = (str) => {
	if (!str) return "desc";
	else if (str.toLowerCase() !== "asc" && str.toLowerCase() !== "desc") return "desc";
	else return str.toLowerCase();
};

export const return_order_by_for_others = (str) => {
	if (!str) return "createdAt";
	else if (str !== "updatedAt") return "createdAt";
	else return (str === "updatedAt") ? str : str.toLowerCase();
};

export const return_order_to_array = (from_address, to_address, amount, quantity, product_data, seller_user_data, product_images_data) => {
	return [
		{
			from_address,
			to_address,
			amount,
			quantity,
			product_name: product_data.name,
			product_image: product_images_data !== null ? product_images_data[0].image : dummy_product_image,
			seller: seller_user_data.firstname + (seller_user_data.middlename ? " " + seller_user_data.middlename + " " : " ") + seller_user_data.lastname,
			seller_photo: seller_user_data.photo
		}
	];
};

export const return_bulk_product_images_array = (images, data) => {
	var results = [];
	for (let index = 0; index < images.length; index++) {
		const element = images[index];

		results.push({
			unique_id: uuidv4(),
			product_unique_id: data.product_unique_id,
			image: element.secure_url,
			image_type: element.format,
			image_public_id: element.public_id,
			status: 1
		});

		if (index === images.length - 1) return results;
	}
};

export const return_bulk_rating_images_array = (images, data) => {
	var results = [];
	for (let index = 0; index < images.length; index++) {
		const element = images[index];

		results.push({
			unique_id: uuidv4(),
			rating_unique_id: data.rating_unique_id,
			image: element.secure_url,
			image_type: element.format,
			image_public_id: element.public_id,
			status: 1
		});

		if (index === images.length - 1) return results;
	}
};

export const validate_future_date = (date) => {
	const d = new Date(date);
	const today = new Date();
	if (d === "Invalid Date") return false;
	if (today.getTime() > d.getTime()) return false;
	return true;
};

export const validate_past_date = (date) => {
	const d = new Date(date);
	const today = new Date();
	if (d === "Invalid Date") return false;
	if (today.getTime() < d.getTime()) return false;
	return true;
};

export const validate_future_end_date = (_start, _end) => {
	const start = new Date(_start);
	const end = new Date(_end);
	if (start === "Invalid Date") return false;
	if (end === "Invalid Date") return false;
	if (start.getTime() >= end.getTime()) return false;
	return true;
};

export const validate_future_end_date_alt = (_start, _end) => {
	const start = new Date(_start);
	const end = new Date(_end * 1000);
	if (start === "Invalid Date") return false;
	if (end === "Invalid Date") return false;
	if (start.getTime() >= end.getTime()) return false;
	return true;
};

export const validate_product_specification = (value) => {
	if (typeof value === "object") return true
	else return false
};

export const get_min_and_max_ratings = () => {
	let min = ratings[0].value;
	let max = ratings[0].value;

	ratings.forEach(element => {
		const _value = element.value;
		if (_value < min) min = _value;
		if (_value > max) max = _value;
	});

	let both = { min, max };

	return both;
};

export const validate_ratings = (rating) => {
	const min_max = get_min_and_max_ratings();
	if (rating < min_max.min) return false;
	if (rating > min_max.max) return false;
	return true;
};

export const validate_payment_method = (obj) => {
	const method = obj;
	if (
		// method !== payment_methods.card && 
		// method !== payment_methods.wallet && 
		// method !== payment_methods.transfer && 
		method !== payment_methods.crypto && 
		method !== payment_methods.paypal
	) return false;
	return true;
};

export const validate_gateway = (obj) => {
	const method = obj;
	if (
		// method !== gateways.paystack && 
		// method !== gateways.squad && 
		// method !== gateways.internal && 
		method !== gateways.coinbase && 
		method !== gateways.wallets && 
		method !== gateways.paypal
	) return false;
	return true;
};

export const validate_transaction_types = (obj) => {
	const method = obj;
	if (
		method !== transaction_types.charges &&
		method !== transaction_types.deposit &&
		method !== transaction_types.payment &&
		method !== transaction_types.subscription &&
		method !== transaction_types.withdrawal &&
		method !== transaction_types.refund && 
		method !== transaction_types.reversal
	) return false;
	return true;
};

export const validate_app_default_type = (app_default) => {
	if (!app_defaults_data_type.includes(app_default)) return false;
	return true;
};

export const validate_app_default_value = (value, data_type) => {
	if (data_type === "BOOLEAN" && typeof value === "boolean") return true
	else if (data_type === "STRING" && typeof value === "string") return true
	else if (data_type === "INTEGER" && typeof value === "number") return true
	else if (data_type === "BIGINT" && typeof value === "bigint") return true
	else if (data_type === "ARRAY" && Array.isArray(value) && value.length !== 0) return true
	else if (data_type === "MAP" && typeof value === "object") return true
	else return false
};

export const return_all_orders_table = (orders, currency) => {
	let order_table_html = "";
	for (let index = 0; index < orders.length; index++) {
		order_table_html += `
			<div>
				<hr>
				<table style="width: 100%; vertical-align: top;">
					<tr>
						<td style="width: 150px; vertical-align: top;">
							<img style="display: block; height: 120px; width: 120px; object-fit: cover; object-position: center;"
								src="${orders[index].product_image}" alt="${orders[index].product_name} - Product Image">
						</td>
						<td style="width: calc(100% - 150px); vertical-align: top;">
							<p style="margin-bottom: 10px; font-size: small;">${orders[index].product_name}</p>
							<p style="margin-bottom: 10px; font-size: small; font-weight: bold;">${currency} ${orders[index].amount} <span
									style="float: right; font-weight: lighter;">x${orders[index].quantity}</span></p>
						</td>
					</tr>
				</table>
			</div>	
		`;

		if (index === orders.length - 1) return order_table_html;
	}
};

export const return_bulk_payments_array = (courses, data) => {
	var results = [];
	for (let index = 0; index < courses.length; index++) {
		const element = courses[index];
		const details = `NGN ${element.amount.toLocaleString()} ${transaction_types.payment.toLowerCase()} via ${payment_methods.card} for ${element.title} course`;

		results.push({
			unique_id: uuidv4(),
			user_unique_id: data.user_unique_id,
			course_unique_id: element.unique_id,
			type: transaction_types.payment,
			gateway: data.gateway,
			payment_method: payment_methods.card,
			amount: parseInt(element.amount),
			reference: data.reference,
			payment_status: processing,
			details,
			status: 1
		});

		if (index === courses.length - 1) return results;
	}
};

export const return_enrollment_courses_array = (payments, data) => {
	var results = [];
	for (let index = 0; index < payments.length; index++) {
		const element = payments[index];

		results.push({
			unique_id: uuidv4(),
			user_unique_id: data.user_unique_id,
			course_unique_id: element.course_unique_id,
			enrollment_status: ongoing,
			status: 1
		});

		if (index === payments.length - 1) return results;
	}
};

export const return_courses_from_payments = (payments, data) => {
	var results = [];
	for (let index = 0; index < payments.length; index++) {
		const element = payments[index];

		results.push(element.course_unique_id);

		if (index === payments.length - 1) return results;
	}
};

export const paginate = (page, _records, total_records) => {
	// Get total pages available for the amount of records needed in each page with total records
	// const records = !_records || _records < paginate_limit ? paginate_limit : _records;
	const records = !_records ? paginate_limit : _records;
	const pages = Math.ceil(total_records / records);
	// return false if page is less than 1 (first page) or greater than pages (last page)
	if (page < 1 || page > pages || !page) {
		return {
			start: 0,
			end: total_records < records ? total_records : records,
			pages: pages,
			limit: total_records < records ? total_records : records,
		};
	}

	// get the end limit
	const end = pages === page ? total_records : (page === 1 ? page * records : page * records);
	// get start limit
	// if records are uneven at the last page, show all records from last ending to the end
	const start = page === 1 ? 0 : (pages === page ? ((total_records - records) - (total_records - (page * records))) : end - records);

	// return object
	return {
		start: start,
		end: end,
		pages: pages,
		limit: end - start,
	};
};
