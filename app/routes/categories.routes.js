import { checks } from "../middleware/index.js";
import { categories_rules } from "../rules/categories.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	addCategory, deleteCategory, publicGetCategories, publicGetCategory, publicSearchCategories, rootGetCategories, rootGetCategoriesSpecifically, rootGetCategory, 
	rootSearchCategories, updateCategoryDetails, updateCategoryImage
} from "../controllers/categories.controller.js";

export default function (app) {
	app.get("/root/category/all", [checks.verifyKey, checks.isRootKey], rootGetCategories);
	app.get("/root/search/categories", [checks.verifyKey, checks.isRootKey, default_rules.forSearching], rootSearchCategories);
	app.get("/root/category/via/stripped", [checks.verifyKey, checks.isRootKey, categories_rules.forFindingViaStripped], rootGetCategory);
	app.get("/root/category", [checks.verifyKey, checks.isRootKey, categories_rules.forFindingCategoryInternal], rootGetCategory);

	app.get("/categories", publicGetCategories);
	app.get("/search/categories", [default_rules.forSearching], publicSearchCategories);
	app.get("/category", [categories_rules.forFindingCategory], publicGetCategory);
	app.get("/category/via/stripped", [categories_rules.forFindingViaStripped], publicGetCategory);

	app.post("/root/category/add", [checks.verifyKey, checks.isRootKey, categories_rules.forAdding], addCategory);

	app.put("/root/category/edit/name", [checks.verifyKey, checks.isRootKey, categories_rules.forFindingCategory, categories_rules.forUpdatingDetails], updateCategoryDetails);
	app.put("/root/category/edit/image", [checks.verifyKey, checks.isRootKey, categories_rules.forFindingCategory, categories_rules.forUpdatingImage], updateCategoryImage);

	app.delete("/root/category", [checks.verifyKey, checks.isRootKey, categories_rules.forFindingCategory], deleteCategory);
};
