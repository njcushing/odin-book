import express from "express";
import * as github from "./github";

const router = express.Router();

router.get("/github", github.get);
router.get("/github/callback", github.callback);

export default router;
