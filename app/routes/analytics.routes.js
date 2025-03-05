import { checks } from "../middleware/index.js";
import { default_rules } from "../rules/default.rules.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

export default function (app) {
	app.get("/root/analytics", getAnalytics);
};