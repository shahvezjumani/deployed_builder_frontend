import { Router } from "express";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../controllers/project.controller.js";

router.use(verifyJWT);

router.post("/create-project", upload.single("imgUrlFile"), createProject);
router.delete("/delete/:id", deleteProject);
router.put("/update-project/:id", upload.single("imgUrlFile"), updateProject);

export default router;
