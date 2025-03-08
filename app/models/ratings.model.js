import { db_end, db_start } from "../config/config";
import usersModel from "./users.model.js";
import productsModel from "./products.model.js";
import ordersModel from "./orders.model.js";

export default (sequelize, Sequelize) => {

	const users = usersModel(sequelize, Sequelize);
	const products = productsModel(sequelize, Sequelize);
	const orders = ordersModel(sequelize, Sequelize);

	const ratings = sequelize.define("rating", {
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
		order_unique_id: {
			type: Sequelize.STRING(40),
			allowNull: true,
			references: {
				model: orders,
				key: "unique_id"
			}
		},
		fullname: {
			type: Sequelize.STRING(150),
			allowNull: true,
		},
		rating: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		},
		description: {
			type: Sequelize.STRING(3000),
			allowNull: true,
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}ratings${db_end}`
	});
	return ratings;
};