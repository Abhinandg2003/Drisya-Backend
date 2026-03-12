import mongoose from "mongoose";

export const POSITION_DEPARTMENTS = [
  "Sales & Showroom",
  "Design & Visual Merchandising",
  "Marketing & Digital",
  "Operations & Logistics",
];

export const POSITION_TYPES = ["Full-time", "Part-time"];

const openPositionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: [
        {
          type: String,
          enum: POSITION_DEPARTMENTS,
        },
      ],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one department is required.",
      },
    },
    type: {
      type: [
        {
          type: String,
          enum: POSITION_TYPES,
        },
      ],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one job type is required.",
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one requirement is required.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const OpenPositionModel =
  mongoose.models.openPosition ||
  mongoose.model("openPosition", openPositionSchema);

export default OpenPositionModel;
