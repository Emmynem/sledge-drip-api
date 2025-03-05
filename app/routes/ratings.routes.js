import { checks } from "../middleware/index.js";
import { rating_rules } from "../rules/ratings.rules.js";
import { order_rules } from "../rules/orders.rules.js";
import { product_rules } from "../rules/products.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	getRating, getRatings, getRatingsSpecifically, rootGetRating, rootGetRatings, rootGetRatingsSpecifically, addExternalRating, addRating, 
	deleteRating, deleteRatingImage, uploadRatingImages
} from "../controllers/ratings.controller.js";

export default function (app) {
	app.get("/root/ratings/all", [checks.verifyKey, checks.isRootKey], rootGetRatings);
	app.get("/root/ratings/via/user", [checks.verifyKey, checks.isRootKey, user_rules.forFindingUserAlt], rootGetRatingsSpecifically);
	app.get("/root/ratings/via/product", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProductAlt], rootGetRatingsSpecifically);
	app.get("/root/ratings/via/order", [checks.verifyKey, checks.isRootKey, order_rules.forFindingOrderAlt], rootGetRatingsSpecifically);
	app.get("/root/rating", [checks.verifyKey, checks.isRootKey, rating_rules.forFindingRating], rootGetRating);

	app.get("/ratings/via/product", [product_rules.forFindingProductAlt], rootGetRatingsSpecifically);
	app.get("/ratings/via/order", [order_rules.forFindingOrderAlt], rootGetRatingsSpecifically);
	app.get("/rating", [rating_rules.forFindingRating], rootGetRating);
	
	app.get("/user/ratings", [checks.verifyToken, checks.isUser], getRatings);
	app.get("/user/ratings/via/product", [checks.verifyToken, checks.isUser, product_rules.forFindingProductAlt], getRatingsSpecifically);
	app.get("/user/ratings/via/order", [checks.verifyToken, checks.isUser, order_rules.forFindingOrderAlt], getRatingsSpecifically);
	app.get("/user/rating", [checks.verifyToken, checks.isUser, rating_rules.forFindingRating], getRating);

	app.post("/add/update/rating", [product_rules.forFindingProductAlt, order_rules.forFindingOrderAlt, rating_rules.forAddingAndUpdating], addExternalRating);
	app.post("/add/rating/images", [rating_rules.forFindingRatingAlt, rating_rules.forAddingMultipleRatingImages], uploadRatingImages);
	
	app.post("/user/add/update/rating", [checks.verifyToken, checks.isUser, product_rules.forFindingProductAlt, order_rules.forFindingOrderAlt, rating_rules.forAddingAndUpdating], addRating);
	app.post("/user/add/rating/images", [checks.verifyToken, checks.isUser, rating_rules.forFindingRatingAlt, rating_rules.forAddingMultipleRatingImages], uploadRatingImages);

	app.delete("/rating", [rating_rules.forFindingRating], deleteRating);
	app.delete("/rating/image", [rating_rules.forFindingRatingImage], deleteRatingImage);

	app.delete("/user/rating", [checks.verifyToken, checks.isUser, rating_rules.forFindingRating], deleteRating);
	app.delete("/user/rating/image", [checks.verifyToken, checks.isUser, rating_rules.forFindingRatingImage], deleteRatingImage);
};
