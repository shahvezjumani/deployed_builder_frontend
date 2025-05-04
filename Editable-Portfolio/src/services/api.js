import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
});

// ----------------- USER APIs -----------------

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post(
    "/user/login",
    { email, password },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response;
};

export const registerUser = async (formData) => {
  const response = await axiosInstance.post("/user/register", formData, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/user/me");
  return response;
};

export const getUserBySlug = async (slug) => {
  const response = await axiosInstance.get(`/user/u/${slug}`);
  return response;
};

export const userUpdate = async (userData) => {
  const response = await axiosInstance.put("/user/update", userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const changePassword = async (password, confirmPassword) => {
  const response = await axiosInstance.post(
    "/user/change-password",
    { password, confirmPassword },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response;
};

// ----------------- PROJECT APIs -----------------

export const createProject = async (project) => {
  const response = await axiosInstance.post(
    "/project/create-project",
    project,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};

export const updateProject = async (projectId, project) => {
  const response = await axiosInstance.put(
    `/project/update-project/${projectId}`,
    project,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};
