const mongoose = require("mongoose");
const { Schema } = mongoose; // Extract Schema from mongoose

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

const Comment = mongoose.model("comment",commentSchema);

module.exports = Comment;