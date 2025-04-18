import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  // Extract user data from request body
  const { userName, email, password } = req.body;

  // Validate required fields
  if (!userName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Generate a slug from username
  const slug = userName.toLowerCase().replace(/\s+/g, "-");

  // Check if slug already exists
  const slugExists = await User.findOne({ slug });
  if (slugExists) {
    throw new ApiError(
      409,
      "Username already taken, please choose a different name"
    );
  }

  // Create new user
  const user = await User.create({
    userName,
    email,
    password,
    slug,
  });

  // Remove password and refreshToken from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  // Extract login data from request body
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Get user without sensitive information
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Set cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // Update user to remove refresh token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: null },
    },
    { new: true }
  );

  // Clear cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Get current user profile
const getCurrentUser = asyncHandler(async (req, res) => {
  // User data should be available from auth middleware in req.user
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

// Update user profile
const updateUser = asyncHandler(async (req, res) => {
  const {
    userName,
    aboutMe,
    skills,
    logoUrl,
    bannerUrl,
    bannerColor,
    theme,
    availabilityHeading,
    topHeading,
    topHeadingHeight,
    availabilityIconUrl,
    aboutMeIconUrl,
    numberOfProjects,
    yearOfExperience,
    emailUrl,
    contactLinks,
  } = req.body;

  // Create an update object with only the fields that were provided
  const updateFields = {};

  if (userName) {
    updateFields.userName = userName;
    // Update slug if username changes
    updateFields.slug = userName.toLowerCase().replace(/\s+/g, "-");

    // Check if slug already exists for another user
    const slugExists = await User.findOne({
      slug: updateFields.slug,
      _id: { $ne: req.user._id },
    });

    if (slugExists) {
      throw new ApiError(
        409,
        "Username already taken, please choose a different name"
      );
    }
  }

  if (aboutMe) updateFields.aboutMe = aboutMe;
  if (skills) updateFields.skills = skills;
  if (logoUrl) updateFields.logoUrl = logoUrl;
  if (bannerUrl) updateFields.bannerUrl = bannerUrl;
  if (bannerColor) updateFields.bannerColor = bannerColor;
  if (theme) updateFields.theme = theme;
  if (availabilityHeading)
    updateFields.availabilityHeading = availabilityHeading;
  if (topHeading) updateFields.topHeading = topHeading;
  if (topHeadingHeight) updateFields.topHeadingHeight = topHeadingHeight;
  if (availabilityIconUrl)
    updateFields.availabilityIconUrl = availabilityIconUrl;
  if (aboutMeIconUrl) updateFields.aboutMeIconUrl = aboutMeIconUrl;
  if (numberOfProjects !== undefined)
    updateFields.numberOfProjects = numberOfProjects;
  if (yearOfExperience !== undefined)
    updateFields.yearOfExperience = yearOfExperience;
  if (emailUrl) updateFields.emailUrl = emailUrl;
  if (contactLinks) updateFields.contactLinks = contactLinks;

  // Update user profile
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateFields,
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
});

// Remove/delete user account
const removeUser = asyncHandler(async (req, res) => {
  // Get user ID from authenticated user
  const userId = req.user._id;

  // Delete the user
  await User.findByIdAndDelete(userId);

  // Clean up related data (projects)
  await Project.deleteMany({ _id: { $in: req.user.projects } });

  // Clear cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User account deleted successfully"));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookies or request body
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user with this refresh token
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Check if incoming refresh token matches stored refresh token
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // Set cookies
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Get user profile by slug (for public viewing)
const getUserBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const user = await User.findOne({ slug })
    .select("-password -refreshToken")
    .populate("projects");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  removeUser,
  refreshAccessToken,
  getUserBySlug,
};
