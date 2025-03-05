import { db_end, db_start } from "../config/config";
import categoriesModel from "./categories.model.js";

export default (sequelize, Sequelize) => {

	const categories = categoriesModel(sequelize, Sequelize);

	const products = sequelize.define("product", {
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
		category_unique_id: {
			type: Sequelize.STRING(40),
			allowNull: true,
			references: {
				model: categories,
				key: "unique_id"
			}
		},
		name: {
			type: Sequelize.STRING(200),
			allowNull: false,
		},
		stripped: {
			type: Sequelize.STRING(200),
			allowNull: false,
		},
		description: {
			type: Sequelize.TEXT,
			allowNull: false,
		},
		specification: {
			type: Sequelize.TEXT,
			allowNull: true,
			// get() {
			// 	const _specification = this.getDataValue('specification');
			// 	return (_specification === null || _specification === undefined ? null : JSON.parse(_specification));
			// },
			// set(value) {
			// 	const _specification = JSON.stringify(value);
			// 	this.setDataValue('specification', value === null ? null : _specification);
			// }
		},
		quantity: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		max_quantity: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		remaining: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		price: {
			type: Sequelize.FLOAT,
			allowNull: false,
		},
		sales_price: {
			type: Sequelize.FLOAT,
			allowNull: true,
		},
		views: {
			type: Sequelize.BIGINT,
			allowNull: false,
		},
		favorites: {
			type: Sequelize.BIGINT,
			allowNull: false,
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}products${db_end}`
	});
	return products;
};