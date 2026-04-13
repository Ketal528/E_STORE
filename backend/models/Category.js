const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category Name is Require"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// middlewere to auto-genrate slug before saving 
categorySchema.pre("save", function (next) {
    // Only run this logic if the name is new or has been changed
    if (!this.isModified("name")) {
        return next();
    }

    this.slug = this.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")       // Replace spaces with -
        .replace(/[^\w\-]+/g, "");   // Remove all non-word chars (like symbols)
    
});

module.exports = mongoose.model("Category", categorySchema);