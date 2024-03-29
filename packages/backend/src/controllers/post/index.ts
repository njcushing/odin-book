import express from "express";
import * as get from "./get";
import * as create from "./create";
import * as remove from "./remove";

const router = express.Router();

router.get("/:postId", get.regular);
router.post("/", create.regular);
router.delete("/:postId", remove.regular);

export default router;
