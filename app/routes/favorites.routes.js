import { checks } from "../middleware/index.js";
import { favorite_rules } from "../rules/favorites.rules.js";
import { product_rules } from "../rules/products.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	getFavorite, getFavorites, getFavoritesSpecifically, rootGetFavorite, rootGetFavorites, rootGetFavoritesSpecifically, addFavorite, deleteFavorite
} from "../controllers/favorites.controller.js";

export default function (app) {
	app.get("/root/favorites/all", [checks.verifyKey, checks.isRootKey], rootGetFavorites);
	app.get("/root/favorites/via/product", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProductAlt], rootGetFavoritesSpecifically);
	app.get("/root/favorite", [checks.verifyKey, checks.isRootKey, favorite_rules.forFindingFavorite], rootGetFavorite);

	app.get("/user/favorites", [checks.verifyToken, checks.isUser], getFavorites);
	app.get("/user/favorites/via/product", [checks.verifyToken, checks.isUser, product_rules.forFindingProductAlt], getFavoritesSpecifically);
	app.get("/user/favorite", [checks.verifyToken, checks.isUser, favorite_rules.forFindingFavorite], getFavorite);

	app.post("/user/favorite/toggle", [checks.verifyToken, checks.isUser, favorite_rules.forAdding], addFavorite);

	app.delete("/user/favorite", [checks.verifyToken, checks.isUser, favorite_rules.forFindingFavorite], deleteFavorite);
};
