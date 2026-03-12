import BlogModel from "../models/blogModel.js";

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => `${item}`.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => `${item}`.trim())
          .filter(Boolean);
      }
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const buildBlogPayload = (body) => {
  const uploadedImageUrl = body.uploadedImageUrl?.trim();
  const existingImage = body.existingImage?.trim();
  const payload = {
    title: body.title?.trim(),
    description: body.description?.trim(),
    content: body.content?.trim(),
    image: uploadedImageUrl || existingImage || "",
    tag: normalizeStringArray(body.tag),
    readTime: Number(body.readTime),
    author: body.author?.trim(),
    date: body.date ? new Date(body.date) : null,
  };

  if (!payload.title || !payload.description || !payload.content || !payload.author) {
    return { error: "Title, description, content, and author are required." };
  }

  if (!payload.tag.length) {
    return { error: "Select at least one blog tag." };
  }

  if (!Number.isFinite(payload.readTime) || payload.readTime < 1) {
    return { error: "Read time must be a number greater than 0." };
  }

  if (!(payload.date instanceof Date) || Number.isNaN(payload.date.getTime())) {
    return { error: "Provide a valid publish date." };
  }

  return { payload };
};

const createBlog = async (req, res) => {
  try {
    if (req.file) {
      req.body.uploadedImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const { payload, error } = buildBlogPayload(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const blog = await BlogModel.create(payload);

    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const listBlogs = async (_req, res) => {
  try {
    const blogs = await BlogModel.find({}).sort({ date: -1, createdAt: -1 });

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    if (req.file) {
      req.body.uploadedImageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const { payload, error } = buildBlogPayload(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const blog = await BlogModel.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    return res.json({
      success: true,
      message: "Blog updated successfully.",
      blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    return res.json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createBlog, listBlogs, updateBlog, deleteBlog };
