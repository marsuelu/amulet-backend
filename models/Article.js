const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "title is required",
      maxLength: 50,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: "content is required",
    },
    slug: {
      type: String,
      required: "slug is required",
      unique: true,
      trim: true,
      maxLength: 200,
    }, // unique, used in URL
    summary: {
      type: String,
      required: "summary is required",
      maxLength: 200,
    }, // short preview text for homepage
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

module.exports = mongoose.model("Article", ArticleSchema);
