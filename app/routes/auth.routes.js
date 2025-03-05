import { checks } from "../middleware/index.js";

export default function (app) {
	app.post("/auth/admin/signin", [checks.verifyKey, checks.keyExists]);
};
