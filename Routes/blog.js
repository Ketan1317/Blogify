const express = require("express");
const blogRouter = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Blog = require("../Models/blog");
const Comment = require("../Models/comments");

// Ensure the uploads directory exists
const uploadPath = path.resolve("./public/uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true }); // Create directory recursively
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

blogRouter.get("/add-new", (req, res) => {
    res.render("AddBlog", {
        user: req.user,
    });
});

blogRouter.post("/", upload.single("CoverImage"), async (req, res) => {
    const { body, title } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    res.redirect(`/blog/${blog._id}`);
});

blogRouter.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    console.log("blog",blog);
    console.log("comments",comments);

    res.render("blog", {
        user: req.user,
        blogDetails: blog,
        comments: comments, 
    });
});

blogRouter.post("/comments/:blogid", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogid,
        createdBy: req.user._id,
    });
    console.log("op");

    return res.redirect(`/blog/${req.params.blogid}`);
});

module.exports = { blogRouter };