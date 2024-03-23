import express from "express";
import * as login from "./login";
import * as github from "./github";

const router = express.Router();

router.post("/login", login.post);

router.get("/github", github.get);
router.get("/github/login", github.login);

export default router;
