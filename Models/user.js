const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createToken } = require("../services/auth");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Path `username` is required.'], // Ensures username is required
            unique: true, // Optional: if usernames should be unique
            trim: true,
          },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            default: "/images/dev.jpg",
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
    },
    { timestamps: true }
);

// Middleware for password hashing
userSchema.pre("save", function (next) {
    const user = this;
    // Skip hashing if the password is not modified
    if (!user.isModified("password")) return next();
    // Generate a new salt for each user
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    user.salt = salt;
    user.password = hashedPassword;
    next();
});

// Static method to match passwords
userSchema.statics.matchPasswordandCreateToken = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const hashedPassword = createHmac("sha256", user.salt).update(password).digest("hex");

    if (hashedPassword !== user.password) throw new Error("Incorrect password");

    return createToken(user);
};

const User = mongoose.model("User", userSchema);

module.exports = { User };