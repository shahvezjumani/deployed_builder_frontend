import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFileFromCloudinary,
} from "../utils/cloudinary.js";

const getFilePath = (files, fieldName) => {
  return files && Array.isArray(files[fieldName]) && files[fieldName].length > 0
    ? files[fieldName][0].path
    : null;
};

const uploadIfExists = async (localPath, uploadFn) => {
  return localPath ? await uploadFn(localPath) : null;
};

const buildUpdateFields = (uploadsMap) => {
  const fields = {};
  for (const [key, value] of Object.entries(uploadsMap)) {
    if (value) fields[key] = value.url;
  }
  return fields;
};

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    console.log("Success");

    const refreshToken = user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wwrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const slug = userName.toLowerCase().replace(/\s+/g, "-");

  const slugExists = await User.findOne({ slug });
  if (slugExists) {
    throw new ApiError(
      409,
      "Username already taken, please choose a different name"
    );
  }

  const user = await User.create({
    userName,
    email,
    password,
    slug,
  });

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

const updateUser = asyncHandler(async (req, res) => {
  const {
    aboutMe,
    skills,
    bannerColor,
    theme,
    availabilityHeading,
    topHeading,
    topHeadingHeight,
    numberOfProjects,
    yearOfExperience,
    emailUrl,
    contactLinks,
  } = req.body;

  console.log(skills);

  const logoUrlLocalPath = getFilePath(req.files, "logoUrlFile");
  const bannerUrlLocalPath = getFilePath(req.files, "bannerUrlFile");
  const availabilityIconUrlLocalPath = getFilePath(
    req.files,
    "availabilityIconUrlFile"
  );
  const aboutMeIconUrlLocalPath = getFilePath(req.files, "aboutMeIconUrlFile");
  // console.log(req.files.bannerUrl[0]);

  // Upload to Cloudinary
  const [logoUrl, bannerUrl, availabilityIconUrl, aboutMeIconUrl] =
    await Promise.all([
      uploadIfExists(logoUrlLocalPath, uploadOnCloudinary),
      uploadIfExists(bannerUrlLocalPath, uploadOnCloudinary),
      uploadIfExists(availabilityIconUrlLocalPath, uploadOnCloudinary),
      uploadIfExists(aboutMeIconUrlLocalPath, uploadOnCloudinary),
    ]);
  // console.log(req.files?.bannerUrlFile[0]?.path, "Bro I am files");
  // console.log(req.files?.logoUrlFile[0]?.path, "Bro I am files");
  console.log(aboutMe);

  // Create updateFields object with only the fields that were provided

  const updateFields = buildUpdateFields({
    logoUrl,
    bannerUrl,
    availabilityIconUrl,
    aboutMeIconUrl,
  });

  // Create an update object with only the fields that were provided

  // if (userName) {
  //   updateFields.userName = userName;
  // Update slug if username changes
  // updateFields.slug = userName.toLowerCase().replace(/\s+/g, "-");

  // Check if slug already exists for another user
  //   const slugExists = await User.findOne({
  //     slug: updateFields.slug,
  //     _id: { $in: req.user._id },
  //   });

  //   if (slugExists) {
  //     throw new ApiError(
  //       409,
  //       "Username already taken, please choose a different name"
  //     );
  //   }
  // }

  if (aboutMe) updateFields.aboutMe = aboutMe;
  if (skills) updateFields.skills = skills;
  if (bannerColor) updateFields.bannerColor = bannerColor;
  if (theme) updateFields.theme = theme;
  if (availabilityHeading)
    updateFields.availabilityHeading = availabilityHeading;
  if (topHeading) updateFields.topHeading = topHeading;
  if (topHeadingHeight) updateFields.topHeadingHeight = topHeadingHeight;
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

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -refreshToken")
    .populate("projects");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let userResponse = user.toObject();
  const projects = await Project.find({ owner: user._id }).select("-owner");
  if (projects?.length > 0) {
    // user.projects = projects;
    // console.log(projects)
    // Convert to plain object
    userResponse.projects = projects;
  }
  console.log(userResponse);

  // Add the projects to the user object before sending response
  // const userResponse = user.toObject(); // Convert to plain object

  return res
    .status(200)
    .json(
      new ApiResponse(200, userResponse, "User details fetched successfully")
    );
});

const removeUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);

  await Project.deleteMany({ _id: { $in: req.user.projects } });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User account deleted successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
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

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: null },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

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

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export {
  registerUser,
  updateUser,
  getCurrentUser,
  getUserBySlug,
  removeUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
};
