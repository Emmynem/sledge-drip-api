import { db_end, db_start } from "../config/config";
import usersModel from "./users.model.js";
import productsModel from "./products.model.js";

export default (sequelize, Sequelize) => {

	const users = usersModel(sequelize, Sequelize);
	const products = productsModel(sequelize, Sequelize);

	const carts = sequelize.define("cart", {
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
		shipping_fee: {
			type: Sequelize.FLOAT,
			allowNull: true,
		},
		quantity: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}carts${db_end}`
	});
	return carts;
};