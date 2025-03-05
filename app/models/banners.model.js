import { db_end, db_start } from "../config/config.js";

export default (sequelize, Sequelize) => {

	const banners = sequelize.define("banner", {
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
		name: {
			type: Sequelize.STRING(500),
			allowNull: false,
		},
		link: {
			type: Sequelize.STRING(500),
			allowNull: false,
		},
		image: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		image_type: {
			type: Sequelize.STRING(20),
			allowNull: true,
		},
		image_public_id: {
			type: Sequelize.STRING(500),
			allowNull: true,
		},
		status: {
			type: Sequelize.INTEGER(1),
			allowNull: false,
		}
	}, {
		tableName: `${db_start}banners${db_end}`
	});
	return banners;
};
