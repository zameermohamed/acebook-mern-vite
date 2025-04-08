const mongoose = require("mongoose");
const User = require("./user");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
const PostSchema = new mongoose.Schema(
    {
        message: { type: String, required: false },
        image: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        likesCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
