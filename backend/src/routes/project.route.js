import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createProject,
  deleteProject,
} from "../controllers/project.controller.js";

router.use(verifyJWT);

router.post("/create-project", upload.single("imgUrlFile"), createProject);
router.delete("/delete-project/:projectId", deleteProject);

export default router;
