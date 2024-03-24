import express from "express";
import * as information from "./information";
import * as createAccount from "./create-account";

const router = express.Router();

router.get("/active", information.active);

router.post("/create-account", createAccount.post);

export default router;
