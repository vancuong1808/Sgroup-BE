import express from 'express';
import apiVoteRoute from "./apis/vote.routes.js";
import authSuserRoute from "./apis/auth.routes.js";
import userRoute from "./apis/user.routes.js";

const routes = express.Router();

routes.use("/vote", apiVoteRoute );
routes.use("/auth", authSuserRoute );
routes.use("/user", userRoute );

routes.get('/HelloWorld', (req, res) => {
    res.send("World")
})

export default routes;