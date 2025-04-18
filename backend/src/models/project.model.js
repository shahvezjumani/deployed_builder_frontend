import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    imgUrl: {
      type: String,
      required: true,
      default: "/images/check_4824138.png",
    },
    title: { type: String, required: true, default: "Your Project Title" },
    keywords: { type: [String], default: [] },
    url: { type: String, default: "/" },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
