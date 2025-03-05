import { checks } from "../middleware/index.js";
import { categories_rules } from "../rules/categories.rules.js";
import { product_rules } from "../rules/products.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	addProduct, deleteProduct, deleteProductImage, publicGetProduct, publicGetProducts, publicGetProductsSpecifically, publicSearchProducts, rootGetProduct, 
	rootGetProducts, rootGetProductsSpecifically, rootSearchProducts, updateProductDetails, updateProductName, updateProductPrices, updateProductStock, uploadProductImages
} from "../controllers/products.controller.js";

export default function (app) {
	app.get("/root/products/all", [checks.verifyKey, checks.isRootKey], rootGetProducts);
	app.get("/root/search/products", [checks.verifyKey, checks.isRootKey, default_rules.forSearching], rootSearchProducts);
	app.get("/root/products/via/category", [checks.verifyKey, checks.isRootKey, categories_rules.forFindingCategoryAlt], rootGetProductsSpecifically);
	app.get("/root/product/via/stripped", [checks.verifyKey, checks.isRootKey, product_rules.forFindingViaStripped], rootGetProduct);
	app.get("/root/product", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProduct], rootGetProduct);
	
	app.get("/home/products/all", publicGetProducts);
	app.get("/home/search/products/all", [default_rules.forSearching], publicSearchProducts);
	app.get("/home/products/via/category", [categories_rules.forFindingCategoryAlt], publicGetProductsSpecifically);
	app.get("/home/product/via/stripped", [product_rules.forFindingViaStripped], publicGetProduct);
	app.get("/home/product", [product_rules.forFindingProduct], publicGetProduct);

	app.post("/root/add/product", [checks.verifyKey, checks.isRootKey, product_rules.forAdding], addProduct);
	app.post("/root/add/product/images", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProductAlt, product_rules.forAddingMultipleProductImages], uploadProductImages);

	app.put("/root/update/product/name", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProduct, product_rules.forUpdatingName], updateProductName);
	app.put("/root/update/product/category", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProduct, product_rules.forUpdatingCategory], updateProductDetails);
	app.put("/root/update/product/description", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProduct, product_rules.forUpdatingDescription], updateProductDetails);
	app.put("/root/update/product/prices", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProduct, product_rules.forUpdatingPrices], updateProductPrices);
	app.put("/root/update/product/stock", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProduct, product_rules.forUpdatingStock], updateProductStock);
	app.put("/root/update/product/specification", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProduct, product_rules.forUpdatingSpecification], updateProductDetails);
	
	app.delete("/root/product", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProduct], deleteProduct);
	app.delete("/root/product/image", [checks.verifyKey, checks.isRootKey, product_rules.forFindingProductImage], deleteProductImage);
};
