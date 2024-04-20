import express from "express";
import * as create from "./create";

const router = express.Router();

router.post("/", create.regular);

export default router;
