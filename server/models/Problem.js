const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    difficulty: String,
    description: String,
    examples: Array,
    constraints: [String],
    tags: [String],
    starterCode: String,
    testCases: Array
});

problemSchema.pre("save", function (next) {
    if (!this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }
    next();
});

module.exports = mongoose.model("Problem", problemSchema);