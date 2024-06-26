import express from "express";
import * as get from "./get";
import * as create from "./create";
import * as put from "./put";

const router = express.Router();

router.get("/:userId/summary", get.summary);
router.get("/:userId/posts", get.posts);
router.get("/:userId/likes", get.likes);
router.get("/:userId/option", get.option);
router.get("/:userId/followers/users", get.followers);
router.get("/:userId/following/users", get.following);
router.get("/:userId/chats", get.chats);
router.get("/:userId/recommended-users", get.recommendedUsers);
router.get("/:userId/chat-activity", get.chatActivity);
router.get("/:userId/recommended-posts", get.recommendedPosts);
router.get("/id", get.idFromTag);
router.get("/overviewFromTag", get.overviewFromTag);
router.get("/active", get.active);
router.post("/", create.regular);
router.put("/:userId/follow", put.follow);
router.put("/:userId/preferences/displayName", put.preferencesDisplayName);
router.put("/:userId/preferences/bio", put.preferencesBio);
router.put("/:userId/preferences/profileImage", put.preferencesProfileImage);
router.put("/:userId/preferences/headerImage", put.preferencesHeaderImage);
router.put("/:userId/preferences/theme", put.preferencesTheme);

export default router;
