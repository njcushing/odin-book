import express from "express";
import * as get from "./get";
import * as create from "./create";

const router = express.Router();

router.get("/:userId/posts", get.posts);
router.get("/id", get.idFromTag);
router.get("/active", get.active);
router.post("/", create.regular);

export default router;
