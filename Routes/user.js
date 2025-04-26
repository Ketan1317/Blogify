const express = require("express");
const { User } = require("../Models/user");
const router = express.Router();
const cookieName = "token";

router.get("/signin", (req, res) => {
    res.render("signin");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    await User.create({ username, email, password });
    res.redirect("/");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordandCreateToken(email, password);
        res.cookie(cookieName, token).redirect("/");
    } catch (error) {
        res.render("signin", { error: "Incorrect Email OR Password" });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie(cookieName).redirect("/");
});

module.exports = { router };
