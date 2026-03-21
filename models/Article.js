import mongoose from "mongoose";
import { ROLES } from "../config/user";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "title is required",
      max: 200,
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
      max: 200,
    }, // unique, used in URL
    excerpt: {
      type: String,
      required: "excerpt is required",
      max: 200,
    }, // short preview text for homepage
    tags: {
      type: [String],
      default: [],
    },
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
    createdTime: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "updatedBy is required",
    },
    updatedTime: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Article", ArticleSchema);
