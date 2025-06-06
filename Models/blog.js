const mongoose = require("mongoose");

const { Schema } = mongoose; // Extract Schema from mongoose

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User", 
    },
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema); 
module.exports = Blog;
