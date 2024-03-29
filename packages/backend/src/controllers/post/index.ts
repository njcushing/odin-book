import express from "express";
import * as create from "./create";
import * as remove from "./remove";

const router = express.Router();

router.post("/create", create.regular);
router.delete("/delete", remove.regular);

export default router;
