import mongoose from "mongoose";

export const BLOG_TAGS = [
  "Design Guide",
  "Materials",
  "Products",
  "Sanitary Ware",
  "Trends",
];

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    tag: {
      type: [
        {
          type: String,
          enum: BLOG_TAGS,
        },
      ],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one blog tag is required.",
      },
    },
    readTime: {
      type: Number,
      required: true,
      min: 1,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BlogModel = mongoose.models.blog || mongoose.model("blog", blogSchema);

export default BlogModel;
