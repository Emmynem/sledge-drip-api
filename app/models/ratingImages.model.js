import { db_end, db_start } from "../config/config";
import ratingsModel from "./ratings.model.js";

export default (sequelize, Sequelize) => {

	const ratings = ratingsModel(sequelize, Sequelize);

	const ratingImages = sequelize.define("rating_image", {
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
		rating_unique_id: {
			type: Sequelize.STRING(40),
			allowNull: false,
			references: {
				model: ratings,
				key: "unique_id"
			}
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
		tableName: `${db_start}rating_images${db_end}`
	});
	return ratingImages;
};