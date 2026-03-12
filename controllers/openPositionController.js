import OpenPositionModel from "../models/openPositionModel.js";

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
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const buildPositionPayload = (body) => {
  const payload = {
    title: body.title?.trim(),
    department: normalizeStringArray(body.department),
    type: normalizeStringArray(body.type),
    location: body.location?.trim(),
    description: body.description?.trim(),
    requirements: normalizeStringArray(body.requirements),
  };

  if (!payload.title || !payload.location || !payload.description) {
    return { error: "Title, location, and description are required." };
  }

  if (!payload.department.length) {
    return { error: "Select at least one department." };
  }

  if (!payload.type.length) {
    return { error: "Select at least one position type." };
  }

  if (!payload.requirements.length) {
    return { error: "Add at least one requirement." };
  }

  return { payload };
};

const createOpenPosition = async (req, res) => {
  try {
    const { payload, error } = buildPositionPayload(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const openPosition = await OpenPositionModel.create(payload);

    return res.status(201).json({
      success: true,
      message: "Open position created successfully.",
      openPosition,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const listOpenPositions = async (_req, res) => {
  try {
    const openPositions = await OpenPositionModel.find({}).sort({
      createdAt: -1,
      updatedAt: -1,
    });

    return res.json({
      success: true,
      openPositions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateOpenPosition = async (req, res) => {
  try {
    const { payload, error } = buildPositionPayload(req.body);

    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const openPosition = await OpenPositionModel.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!openPosition) {
      return res
        .status(404)
        .json({ success: false, message: "Open position not found." });
    }

    return res.json({
      success: true,
      message: "Open position updated successfully.",
      openPosition,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteOpenPosition = async (req, res) => {
  try {
    const openPosition = await OpenPositionModel.findByIdAndDelete(req.params.id);

    if (!openPosition) {
      return res
        .status(404)
        .json({ success: false, message: "Open position not found." });
    }

    return res.json({
      success: true,
      message: "Open position deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createOpenPosition,
  listOpenPositions,
  updateOpenPosition,
  deleteOpenPosition,
};
