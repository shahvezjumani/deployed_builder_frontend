import mongoose from "mongoose";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFileFromCloudinary,
} from "../utils/cloudinary.js";

const createProject = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const { title, keywords, url } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const hasAlready = await Project.findOne({ title, owner: user });
  if (hasAlready) {
    throw new ApiError(400, "Project has already exists");
  }

  const imageUrlLocalPath = req.file?.path;
  console.log(req.file);

  if (!imageUrlLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const imageUrl = await uploadOnCloudinary(imageUrlLocalPath);
  if (!imageUrl) {
    throw new ApiError(
      500,
      "something went wrong while uploading image on cloudinary"
    );
  }

  const project = await Project.create({
    title,
    keywords: keywords || [],
    url: url || "/",
    imgUrl: imageUrl.url || "",
    owner: user,
  });

  if (!project) {
    throw new ApiError(500, "Something went wrong while creating the project");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid project ID");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  console.log(project, "project");

  const deletedProject = await Project.findOneAndDelete({
    _id: id,
    owner: user,
  });

  if (!deletedProject) {
    throw new ApiError(
      404,
      "Project not found or you don't have permission to delete it"
    );
  }

  const publicId = project?.imgUrl?.split("/").pop().split(".")[0]; // Extract publicId from URL

  const isImageDeleted = await deleteFileFromCloudinary(publicId);
  if (!isImageDeleted) {
    throw new ApiError(500, "Failed to delete image from Cloudinary");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project deleted successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const { title, keywords, url } = req.body;
  const { id: projectId } = req.params;
  const imgUrlLocalPath = req.file?.path;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  if (project.owner.toString() !== user.toString()) {
    throw new ApiError(403, "You don't have permission to update this project");
  }

  let imgUrl;
  if (imgUrlLocalPath) {
    imgUrl = await uploadOnCloudinary(imgUrlLocalPath);
    const publicId = project?.imgUrl?.split("/").pop().split(".")[0]; // Extract publicId from URL

    const isImageDeleted = await deleteFileFromCloudinary(publicId);
    if (!isImageDeleted) {
      throw new ApiError(500, "Failed to delete image from Cloudinary");
    }
  }

  await Project.findByIdAndUpdate(
    projectId,
    {
      title: title || project.title,
      keywords: keywords || project.keywords,
      url: url || project.url,
      imgUrl: imgUrl?.url || project.imgUrl,
    },
    { new: true }
  );
});

export { createProject, deleteProject, updateProject };
