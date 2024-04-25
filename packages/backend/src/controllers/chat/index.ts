import express from "express";
import * as get from "./get";
import * as create from "./create";

const router = express.Router();

router.get("/:chatId/overview", get.overview);
router.get("/:chatId/messages", get.messages);
router.get("/:chatId/message/:messageId", get.message);
router.post("/", create.regular);
router.post("/:chatId/message", create.message);

export default router;
