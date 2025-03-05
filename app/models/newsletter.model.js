import { db_end, db_start } from "../config/config.js";

export default (sequelize, Sequelize) => {

	const newsletter = sequelize.define("newsletter", {
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
		email: {
			type: Sequelize.STRING(255),
			allowNull: false
		},
		subscription: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}newsletter${db_end}`
	});
	return newsletter;
};
