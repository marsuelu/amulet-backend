const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "title is required",
      maxLength: 50,
    },
    summary: {
      type: String,
      required: "summary is required",
      maxLength: 200,
    }, // short preview text for homepage
    keywords: {
      type: [String],
      required: "keywords is required",
    }, // keywords for search
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: "content is required",
    },
    slug: {
      type: String,
      required: "slug is required",
      unique: true,
      // trim: true,
      maxLength: 200,
      set: (v) => v.replace(/\s+/g, "-"),
    }, // unique, used in URL
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "createdBy is required",
    },
    createdAt: {
      type: Date,
      immutable: true,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "updatedBy is required",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
// ArticleSchema.index({ title: "text", summary: "text" });
module.exports = mongoose.model("Article", ArticleSchema);
