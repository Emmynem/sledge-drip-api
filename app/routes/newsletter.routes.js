import { checks } from "../middleware/index.js";
import { newsletter_rules } from "../rules/newsletter.rules.js";
import { default_rules } from "../rules/default.rules.js";
import { rootGetNewsletters, rootGetNewsletter, addNewsletterEmail, updateNewsletterSubscription } from "../controllers/newsletter.controller.js";

export default function (app) {
	app.get("/root/newsletter/all", [checks.verifyKey, checks.isRootKey], rootGetNewsletters);
	app.get("/root/newsletter", [checks.verifyKey, checks.isRootKey, newsletter_rules.forFindingNewsletter], rootGetNewsletter);

	app.post("/add/newsletter", [newsletter_rules.forAdding], addNewsletterEmail);
	app.put("/update/subscription", [newsletter_rules.forUpdatingSubscription], updateNewsletterSubscription);
};