import express from "express";
import auth from "@/controllers/auth";
import user from "@/controllers/user";
import post from "@/controllers/post";

const router = express.Router();

const index = router.get("/", (req, res) => {
    res.send("");
});

const routes = {
    index,
    auth,
    user,
    post,
};

export default routes;
