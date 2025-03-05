import { DB, USER, PASSWORD, HOST, dialect as _dialect, logging as _logging, pool as _pool, dialectOptions as _dialectOptions, timezone, production } from "../config/db.config.js";
import Sequelize from "sequelize";
import apiKeysModel from "./apiKeys.model.js";
import appDefaultsModel from "./appDefaults.model.js";
import usersModel from "./users.model.js";
import cartsModel from "./carts.model.js";
import categoriesModel from "./categories.model.js";
import disputesModel from "./disputes.model.js";
import favoritesModel from "./favorites.model.js";
import ordersModel from "./orders.model.js";
import productsModel from "./products.model.js";
import productImagesModel from "./productImages.model.js";
import ratingsModel from "./ratings.model.js";
import ratingImagesModel from "./ratingImages.model.js";
import transactionsModel from "./transactions.model.js";
import newsletterModel from "./newsletter.model.js";
import bannersModel from "./banners.model.js";

const sequelize = new Sequelize(
	DB,
	USER,
	PASSWORD,
	{
		host: HOST,
		dialect: _dialect,
		logging: _logging,
		operatorsAliases: 0,
		pool: {
			max: _pool.max,
			min: _pool.min,
			acquire: _pool.acquire,
			idle: _pool.idle,
			evict: _pool.evict
		},
		dialectOptions: {
			// useUTC: _dialectOptions.useUTC, 
			dateStrings: _dialectOptions.dateStrings,
			typeCast: _dialectOptions.typeCast
		},
		timezone: timezone
	}
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// * Binding models
db.api_keys = apiKeysModel(sequelize, Sequelize);
db.app_defaults = appDefaultsModel(sequelize, Sequelize);
db.users = usersModel(sequelize, Sequelize);
db.carts = cartsModel(sequelize, Sequelize);
db.categories = categoriesModel(sequelize, Sequelize);
db.disputes = disputesModel(sequelize, Sequelize);
db.favorites = favoritesModel(sequelize, Sequelize);
db.orders = ordersModel(sequelize, Sequelize);
db.products = productsModel(sequelize, Sequelize);
db.product_images = productImagesModel(sequelize, Sequelize);
db.transactions = transactionsModel(sequelize, Sequelize);
db.newsletter = newsletterModel(sequelize, Sequelize);
db.ratings = ratingsModel(sequelize, Sequelize);
db.rating_images = ratingImagesModel(sequelize, Sequelize);
db.banners = bannersModel(sequelize, Sequelize);

// End - Binding models

// Associations

//    - Products
db.categories.hasMany(db.products, { foreignKey: 'category_unique_id', sourceKey: 'unique_id' });
db.products.belongsTo(db.categories, { foreignKey: 'category_unique_id', targetKey: 'unique_id' });

//    - Product Images
db.products.hasMany(db.product_images, { foreignKey: 'product_unique_id', sourceKey: 'unique_id' });
db.product_images.belongsTo(db.products, { foreignKey: 'product_unique_id', targetKey: 'unique_id' });

//    - Carts
db.users.hasMany(db.carts, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.carts.belongsTo(db.users, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

db.products.hasMany(db.carts, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.carts.belongsTo(db.products, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

//    - Orders
db.users.hasMany(db.orders, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.orders.belongsTo(db.users, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

db.products.hasMany(db.orders, { foreignKey: 'product_unique_id', sourceKey: 'unique_id' });
db.orders.belongsTo(db.products, { foreignKey: 'product_unique_id', targetKey: 'unique_id' });

//    - Disputes
db.users.hasMany(db.disputes, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.disputes.belongsTo(db.users, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

db.orders.hasMany(db.disputes, { foreignKey: 'order_unique_id', sourceKey: 'unique_id' });
db.disputes.belongsTo(db.orders, { foreignKey: 'order_unique_id', targetKey: 'unique_id' });

//    - Favorites
db.users.hasMany(db.favorites, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.favorites.belongsTo(db.users, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

// db.products.hasMany(db.favorites, { foreignKey: 'product_unique_id', sourceKey: 'unique_id' });
db.favorites.belongsTo(db.products, { foreignKey: 'product_unique_id', targetKey: 'unique_id' });

//    - Transactions
db.users.hasMany(db.transactions, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.transactions.belongsTo(db.users, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

//    - Ratings
db.users.hasMany(db.ratings, { foreignKey: 'user_unique_id', sourceKey: 'unique_id' });
db.ratings.belongsTo(db.users, { foreignKey: 'user_unique_id', targetKey: 'unique_id' });

db.products.hasMany(db.ratings, { foreignKey: 'product_unique_id', sourceKey: 'unique_id' });
db.ratings.belongsTo(db.products, { foreignKey: 'product_unique_id', targetKey: 'unique_id' });

db.orders.hasMany(db.ratings, { foreignKey: 'order_unique_id', sourceKey: 'unique_id' });
db.ratings.belongsTo(db.orders, { foreignKey: 'order_unique_id', targetKey: 'unique_id' });

//    - Rating Images
db.ratings.hasMany(db.rating_images, { foreignKey: 'rating_unique_id', sourceKey: 'unique_id' });
db.rating_images.belongsTo(db.ratings, { foreignKey: 'rating_unique_id', targetKey: 'unique_id' });


// End - Associations

export default db;
