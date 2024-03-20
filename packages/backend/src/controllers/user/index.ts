import express from "express";
import * as createAccount from "./create-account";

const router = express.Router();

router.post("/create-account", createAccount.post);

export default router;
