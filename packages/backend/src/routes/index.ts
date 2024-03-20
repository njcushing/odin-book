import express from "express";
import auth from "@/controllers/auth";
import user from "@/controllers/user";

const router = express.Router();

const index = router.get("/", (req, res) => {
    res.send("");
});

const routes = {
    index,
    auth,
    user,
};

export default routes;
