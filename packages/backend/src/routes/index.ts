import express from "express";

const router = express.Router();

const index = router.get("/", (req, res) => {
    res.send("");
});

const routes = {
    index,
};

export default routes;
