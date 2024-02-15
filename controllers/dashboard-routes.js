const router = require("express").Router();
const { User, Post } = require("../models");
const isAuth = require("../utils/auth");

// get all posts for a user
router.get("/", async (req, res) => {
    try {
        const postData = await Post.findAll({
            where: { user_id: req.session.user_id },
            attributes: ["id", "title", "content", "date_created"],
            include: [{
                model: User,
                attributes: ["name"]
            }]
        });
        const posts = postData.map((post) => post.get({ plain: true }));
        res.render("dashboard", { posts, loggedIn: req.session.loggedIn });
    } catch (err) {
        res.status(500).json(err);
    }
});


// insert new post
router.post("/post", isAuth, async (req, res) => {
    try {
        const postData = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        });
        const post = postData.get({ plain: true });
        if (postData) {
            res.status(201).json({ id: post.id });
        } else {
            res.status(500).json({ message: "There was an error while creating the post" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// update a post by id
router.put("/post/:id",isAuth, async (req, res) => {
    try {
        const postData = await Post.update(
            {
                title: req.body.title,
                content: req.body.content,
            },
            { where: { id: req.params.id } }
        );
        if (postData) {
            res.status(201).json({ id: req.params.id });
        } else {
            res.status(500).json({ message: "There was an error while updating the post" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete a post by id
router.delete("/post/:id",isAuth, async (req, res) => {
    try {
        const postData = await Post.destroy({ where: { id: req.params.id } });
        if (postData) {
            res.status(200).json(postData);
        }else{
            res.status(404).json({ message: "No post was found with this id" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


// get existing post for edit by id
router.get("/post/:id",isAuth, async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: { id: req.params.id },
            attributes: ["title", "content"]
        });
        if (postData) {
            const post = postData.get({ plain: true });
            res.render("editpost", { post, newPost: false, loggedIn: req.session.loggedIn });
        } else {
            res.status(404).json({ message: "No post found with this id" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;