import { db_end, db_start } from "../config/config";
import usersModel from "./users.model.js";
import productsModel from "./products.model.js";

export default (sequelize, Sequelize) => {

	const users = usersModel(sequelize, Sequelize);
	const products = productsModel(sequelize, Sequelize);

	const orders = sequelize.define("order", {
		id: {
			type: Sequelize.BIGINT,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		unique_id: {
			type: Sequelize.STRING(40),
			allowNull: false,
			unique: true
		},
		user_unique_id: {
			type: Sequelize.STRING(40),
			allowNull: true,
			references: {
				model: users,
				key: "unique_id"
			}
		},
		product_unique_id: {
			type: Sequelize.STRING(40),
			allowNull: false,
			references: {
				model: products,
				key: "unique_id"
			}
		},
		tracking_number: {
			type: Sequelize.STRING(15),
			allowNull: false
		},
		gateway_reference: {
			type: Sequelize.STRING(200),
			allowNull: true,
		},
		contact_fullname: {
			type: Sequelize.STRING(150),
			allowNull: false,
		},
		contact_email: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		shipping_firstname: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		shipping_lastname: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		shipping_address: {
			type: Sequelize.STRING(500),
			allowNull: false
		},
		shipping_state: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		shipping_city: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		shipping_zip_code: {
			type: Sequelize.STRING(15),
			allowNull: false
		},
		billing_firstname: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		billing_lastname: {
			type: Sequelize.STRING(50),
			allowNull: false,
		},
		billing_address: {
			type: Sequelize.STRING(500),
			allowNull: false
		},
		billing_state: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		billing_city: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		billing_zip_code: {
			type: Sequelize.STRING(15),
			allowNull: false
		},
		quantity: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		amount: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		shipping_fee: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		gateway: {
			type: Sequelize.STRING(50),
			allowNull: true,
		},
		payment_method: {
			type: Sequelize.STRING(20),
			allowNull: false,
		},
		paid: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		shipped: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		disputed: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		delivery_status: {
			type: Sequelize.STRING(20),
			allowNull: false,
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}orders${db_end}`
	});
	return orders;
};