import { checks } from "../middleware/index.js";
import { banners_rules } from "../rules/banners.rules.js";
import { user_rules } from "../rules/users.rules.js";
import { default_rules } from "../rules/default.rules.js";
import {
	addBanner, deleteBanner, publicGetBanners, publicGetBanner, publicSearchBanners, rootGetBanners, rootGetBannersSpecifically, rootGetBanner,
	rootSearchBanners, updateBannerDetails, updateBannerImage
} from "../controllers/banners.controller.js";

export default function (app) {
	app.get("/root/banner/all", [checks.verifyKey, checks.isRootKey], rootGetBanners);
	app.get("/root/search/banners", [checks.verifyKey, checks.isRootKey, default_rules.forSearching], rootSearchBanners);
	app.get("/root/banner", [checks.verifyKey, checks.isRootKey, banners_rules.forFindingBannerInternal], rootGetBanner);

	app.get("/banners", publicGetBanners);
	app.get("/search/banners", [default_rules.forSearching], publicSearchBanners);
	app.get("/banner", [banners_rules.forFindingBanner], publicGetBanner);

	app.post("/root/banner/add", [checks.verifyKey, checks.isRootKey, banners_rules.forAdding], addBanner);

	app.put("/root/banner/edit/details", [checks.verifyKey, checks.isRootKey, banners_rules.forFindingBanner, banners_rules.forUpdatingDetails], updateBannerDetails);
	app.put("/root/banner/edit/image", [checks.verifyKey, checks.isRootKey, banners_rules.forFindingBanner, banners_rules.forUpdatingImage], updateBannerImage);

	app.delete("/root/banner", [checks.verifyKey, checks.isRootKey, banners_rules.forFindingBanner], deleteBanner);
};
