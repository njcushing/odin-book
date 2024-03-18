import express from "express";
import auth from "@/controllers/auth";

const router = express.Router();

const index = router.get("/", (req, res) => {
    res.send("");
});

const routes = {
    index,
    auth,
};

export default routes;
