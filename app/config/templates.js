import { return_all_orders_table, year_str } from "./config";

const top_logo = "https://res.cloudinary.com/dabfoaprr/image/upload/v1743447790/sledge_hjqtxb.png";
const bottom_logo = "https://res.cloudinary.com/dabfoaprr/image/upload/v1743447790/sledge_hjqtxb.png";
// const bottom_logo = "https://res.cloudinary.com/dabfoaprr/image/upload/v1743447790/sledge-white_chyrte.png";

const copyright_year = year_str();

export const user_email_verification = (data) => {
	const email_subject = `Verify your email address`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_welcome_with_password = (data) => {
	const email_subject = `Welcome to our store`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_changed_password = (data) => {
	const email_subject = `Password change`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_reset_password = (data) => {
	const email_subject = `Password recovery`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_2fa_otp_login = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_otp = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_reset_pin = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_complete_deposit = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_complete_withdrawal = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_cancelled_deposit = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_cancelled_withdrawal = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_order_processing = (data) => {
	const email_subject = `Order ${data.tracking_number} processing 🟡`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Processing</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Package(s) 📦 are processing 🟡</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your order(s) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> are getting ready to be processed. Please initiate your payment and complete the process to commence shipment.</p>
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Processing</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Package(s) 📦 are processing 🟡</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your order(s) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> are getting ready to be processed. Please initiate your payment and complete the process to commence shipment.</p>
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const user_order_pay = (data) => {
	const email_subject = `Pay for Order - ${data.tracking_number}`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Pay</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Payment of ${data.currency} ${data.amount} is due</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Payment for your order(s) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> is due. Click on the button below to go to the payment page.</p>
				<a href="${data.coinbase_payment_hosted_url}"
			style="display: inline-block; background-color: #2A52BE; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 20px 0;">Pay now</a>
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Pay</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Payment of ${data.currency} ${data.amount} is due</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Payment for your order(s) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> is due. Click on the button below to go to the payment page.</p>
				<a href="${data.coinbase_payment_hosted_url}"
			style="display: inline-block; background-color: #2A52BE; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 20px 0;">Pay now</a>
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const user_order_wallet_pay = (data) => {
	const email_subject = `Pay for Order - ${data.tracking_number}`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Wallet Pay</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Payment of ${data.currency} ${data.amount} is due</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Payment for your order(s) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> is due. Click on the button below to go to the tracking page to complete your payment.</p>
				<a href="https://sledgedrip.com/track/${data.tracking_number}"
			style="display: inline-block; background-color: #2A52BE; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 20px 0;">Pay now</a>
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Wallet Pay</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Payment of ${data.currency} ${data.amount} is due</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Payment for your order(s) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> is due. Click on the button below to go to the tracking page to complete your payment.</p>
				<a href="https://sledgedrip.com/track/${data.tracking_number}"
			style="display: inline-block; background-color: #2A52BE; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 20px 0;">Pay now</a>
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const user_order_paid = (data) => {
	const email_subject = `Order ${data.tracking_number} payment successful 🟢`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Paid</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Payment for your package(s) 📦 has successfully been confirmed 🟢</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Payment for order(s) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has successfully been confirmed, we'll update you as
			the status of your order(s) changes.</p>
				<p style="font-size: 13px; font-weight: bold; padding: 10px; background-color: #e9e9e9; border-radius: 5px; display: inline-block;">
				Amount: ${data.currency} ${data.amount}<br>Payment Method: ${data.payment_method}</p>
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Paid</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Payment for your package(s) 📦 has successfully been confirmed 🟢</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Payment for order(s) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has successfully been confirmed, we'll update you as
			the status of your order(s) changes.</p>
				<p style="font-size: 13px; font-weight: bold; padding: 10px; background-color: #e9e9e9; border-radius: 5px; display: inline-block;">
				Amount: ${data.currency} ${data.amount}<br>Payment Method: ${data.payment_method}</p>
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const user_orders_cancelled = (data) => {
	const email_subject = `Orders cancelled 🔴`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Orders Cancelled</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your order packages 📦 has been cancelled 🔴</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your orders with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has been cancelled successfully.</p>
				
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Orders Cancelled</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your order packages 📦 has been cancelled 🔴</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your orders with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has been cancelled successfully.</p>
				
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const user_order_cancelled = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_order_in_transit = (data) => {
	const email_subject = `Order in transit 🚚`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order In Transit</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your package(s) 📦 are on their way 🚚</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your orders with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> are on their way and will be with you soon.</p>
				
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order In Transit</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your package(s) 📦 are on their way 🚚</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your orders with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> are on their way and will be with you soon.</p>
				
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const user_order_shipped = (data) => {
	const email_subject = `Order shipped 📍`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Shipped</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your package(s) 📦 have arrived at the destination 📍</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your orders with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has arrived at your destination.</p>
				
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Shipped</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your package(s) 📦 have arrived at the destination 📍</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your orders with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has arrived at your destination.</p>
				
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const user_order_received = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const user_order_completed = (data) => {
	const email_subject = `Order completed 🤝`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Completed</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your order(s) 📦 have been completed 🤝</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your orders with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has successfully been completed.</p>
				
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Completed</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your order(s) 📦 have been completed 🤝</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your orders with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has successfully been completed.</p>
				
				<p style="margin-bottom: 10px;">Summary of your order(s) are shown below;</p>
			</div>
			<div class="container"
				style="max-width: 600px; margin: 20px auto; padding: 5px 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 20px;">Order details <span style="float: right;">Total: ${data.currency} ${data.amount}</span></h4>
				${return_all_orders_table(data.orders, data.currency)}
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Customer Information</h4>
				<p style="font-size: small; font-weight: bold;">Shipping address <span style="float: right; font-weight: bold;">Billing address</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_firstname} ${data.shipping_lastname} <span style="float: right; font-weight: lighter;">${data.billing_firstname} ${data.billing_lastname}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_address} <span style="float: right; font-weight: lighter;">${data.billing_address}</span></p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">${data.shipping_city} ${data.shipping_state} ${data.shipping_zip_code} <span style="float: right; font-weight: lighter;">${data.billing_city} ${data.billing_state} ${data.billing_zip_code}</span></p>
				
				<h4 style="margin-top: 20px; margin-bottom: 20px;">Payment Information</h4>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Payment Method: ${data.payment_method}</p>
				<p style="margin-top: -10px; font-size: small; font-weight: lighter;">Delivery Status: ${data.delivery_status}</p>

			</div>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const user_order_refund_dispute = (data) => {
	const email_subject = `Order disputed for refund`;
	const email_text = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Refund Dispute</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your order 📦 has been disputed for a refund</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your order (${data.order_unique_id}) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has
					successfully been disputed for a refund.</p>
				
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;
	const email_html = `
		<!DOCTYPE html>
		<html lang="en">

		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>User Order Refund Dispute</title>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" rel="stylesheet">
		</head>

		<body
			style="background-color: #f5f5f5; font-family: 'Lexend', sans-serif; color: #333333; font-size: 14px; line-height: 1.5; margin: 0; padding: 0;">
			<header style="display: block; text-align: center; padding: 20px;"> <img width="80" height="80" src="${top_logo}"
					alt="logo"> <p style="color: #3175D0;">SLEDGE DRIP</p> </header>
			<div class="container"
				style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
				<h2 style="margin-bottom: 10px; opacity: .7;">Your order 📦 has been disputed for a refund</h2>
				<h3 style="margin-bottom: 20px;">Dear ${data.user_name},</h3>
				<p style="margin-bottom: 10px;">Your order (${data.order_unique_id}) with tracking number <a style="font-size: 15px; opacity: .7;" href="https://sledgedrip.com/track/${data.tracking_number}">${data.tracking_number}</a> has
					successfully been disputed for a refund.</p>
				
				<h4 style="margin-bottom: 10px; opacity: .7">Contact Us</h4>
				<p style="margin-bottom: 20px;">If you have any questions or need any assistance, please contact us at <a
						href="mailto:info@sledgedrip.com" style="color: #223B6D;">customer support</a>. Our support
					team is always ready to
					assist you.</p>
			</div>
			<footer style="padding: 20px; display: block; text-align: center;">
				<a href="https://sledgedrip.com" target="_blank">
					<img width="70" src="${bottom_logo}" alt="logo">
					<p style="color: #3175D0;">SLEDGE DRIP</p>
				</a>
				<div style="margin: 15px 0px;">
					<p style="margin-bottom: 15px;">You are receiving this email because you shopped at <a
							href="https://sledgedrip.com">sledgedrip.com</a></p>
					<p style="margin-bottom: 15px;">Copyright &copy; ${copyright_year}, Sledge Drip, All rights
						reserved.
					</p>
				</div>
			</footer>
		</body>

		</html>
	`;

	return { email_html, email_subject, email_text };
};

export const accept_user_order_refund_dispute = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};

export const deny_user_order_refund_dispute = (data) => {
	const email_subject = `Subject here`;
	const email_text = `Details of email here`;
	const email_html = `Details of email here`;

	return { email_html, email_subject, email_text };
};
