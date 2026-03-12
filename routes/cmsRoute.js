import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  listBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import {
  createOpenPosition,
  deleteOpenPosition,
  listOpenPositions,
  updateOpenPosition,
} from "../controllers/openPositionController.js";

const cmsRouter = express.Router();

cmsRouter.get("/blogs", listBlogs);
cmsRouter.post("/blogs", adminAuth, upload.single("image"), createBlog);
cmsRouter.put("/blogs/:id", adminAuth, upload.single("image"), updateBlog);
cmsRouter.delete("/blogs/:id", adminAuth, deleteBlog);

cmsRouter.get("/open-positions", listOpenPositions);
cmsRouter.post("/open-positions", adminAuth, createOpenPosition);
cmsRouter.put("/open-positions/:id", adminAuth, updateOpenPosition);
cmsRouter.delete("/open-positions/:id", adminAuth, deleteOpenPosition);

export default cmsRouter;
