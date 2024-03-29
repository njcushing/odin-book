import express from "express";
import * as create from "./create";
import * as remove from "./remove";

const router = express.Router();

router.post("/", create.regular);
router.delete("/:postId", remove.regular);

export default router;
