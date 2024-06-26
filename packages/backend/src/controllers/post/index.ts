import express from "express";
import * as get from "./get";
import * as create from "./create";
import * as put from "./put";
import * as remove from "./remove";

const router = express.Router();

router.get("/:postId", get.regular);
router.get("/:postId/likes", get.likes);
router.get("/:postId/replies", get.replies);
router.post("/", create.regular);
router.put("/:postId/like", put.like);
router.delete("/:postId", remove.regular);

export default router;
