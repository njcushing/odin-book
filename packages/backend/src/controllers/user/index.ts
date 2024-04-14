import express from "express";
import * as get from "./get";
import * as create from "./create";
import * as put from "./put";

const router = express.Router();

router.get("/:userId/posts", get.posts);
router.get("/:userId/likes", get.likes);
router.get("/:userId/option", get.option);
router.get("/id", get.idFromTag);
router.get("/active", get.active);
router.post("/", create.regular);
router.put("/:userId/follow", put.follow);

export default router;
