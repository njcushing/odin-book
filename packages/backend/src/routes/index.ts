import express from "express";
import auth from "@/controllers/auth";
import user from "@/controllers/user";
import post from "@/controllers/post";
import chat from "@/controllers/chat";

const router = express.Router();

const index = router.get("/", (req, res) => {
    res.send("");
});

const routes = {
    index,
    auth,
    user,
    post,
    chat,
};

export default routes;
