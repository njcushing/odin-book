import express from "express";
import * as get from "./get";

const router = express.Router();

router.get("/all", get.all);

export default router;
