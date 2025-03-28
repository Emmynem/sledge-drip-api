import { checks } from "../middleware/index.js";
import { app_defaults_rules } from "../rules/appDefaults.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	addAppDefault, deleteAppDefault, publicGetAppDefault, publicSearchAppDefaults, rootGetAppDefault, rootGetAppDefaults, rootGetAppDefaultsSpecifically, 
	rootSearchAppDefaults, updateAppDefaultDetails
} from "../controllers/appDefaults.controller.js";

export default function (app) {
	app.get("/root/app/defaults", [checks.verifyKey, checks.isRootKey], rootGetAppDefaults);
	app.get("/root/search/app/defaults", [checks.verifyKey, checks.isRootKey, default_rules.forSearching], rootSearchAppDefaults);
	app.get("/root/app/default", [checks.verifyKey, checks.isRootKey, app_defaults_rules.forFindingAppDefault], rootGetAppDefault);

	app.get("/search/app/defaults", [default_rules.forSearching], publicSearchAppDefaults);
	app.get("/app/default", [app_defaults_rules.forFindingAppDefault], publicGetAppDefault);

	app.post("/root/app/default/add", [checks.verifyKey, checks.isRootKey, app_defaults_rules.forAddingAndUpdating], addAppDefault);

	app.put("/root/app/default/edit", [checks.verifyKey, checks.isRootKey, app_defaults_rules.forFindingAppDefault, app_defaults_rules.forAddingAndUpdating], updateAppDefaultDetails);
	
	app.delete("/root/app/default", [checks.verifyKey, checks.isRootKey, app_defaults_rules.forFindingAppDefault], deleteAppDefault);
};
