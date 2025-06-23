import mongoose, { Schema } from "mongoose";
import { Project } from "./project.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    logoUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dqkvzcglf/image/upload/v1750697452/favicon_npgpb6.svg",
    },
    isAppEditable: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "theme-dark",
    },
    availabilityHeading: {
      type: String,
      default: "Available for work",
    },
    topHeading: {
      type: String,
      default: "Write your top heading here",
    },
    topHeadingHeight: {
      type: String,
      default: "152",
    },
    availabilityIconUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dqkvzcglf/image/upload/v1750697315/avatar-1_p8v1d9.png",
    },
    bannerUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dqkvzcglf/image/upload/v1750698190/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651_jptfer.jpg",
    },
    bannerColor: {
      type: String,
      default: "#38bdf8",
    },
    aboutMe: {
      type: String,
      default:
        "Write your about me here. This is a great place to introduce yourself and share your story with the world.",
    },
    numberOfProjects: {
      type: Number,
      default: 45,
    },
    yearOfExperience: {
      type: Number,
      default: 10,
    },
    aboutMeIconUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/dqkvzcglf/image/upload/v1750697385/icons8-edit-image-48_yghwkc.png",
    },
    skills: {
      type: [Object],
      default: [],
    },
    projects: {
      type: [Schema.Types.ObjectId],
      ref: "Project",
      default: [],
    },
    emailUrl: {
      type: String,
      default: "/",
    },
    contactLinks: {
      github: { type: String, default: "/" },
      twitter: { type: String, default: "/" },
      linkedin: {
        type: String,
        default: "/",
      },
      instagram: { type: String, default: "/" },
    },
    resume: {
      type: String,
      default:
        "https://res.cloudinary.com/dqkvzcglf/image/upload/v1745059595/Shahvez_Jumani_Resume_ubmh2l.pdf",
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpiry: {
      type: Number,
      default: 0,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpiry: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKIN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKIN_EXPIRY,
    }
  );
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
