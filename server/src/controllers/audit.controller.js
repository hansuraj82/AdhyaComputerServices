import Audit from "../models/audit.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAuditLogs = asyncHandler(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.userId) {
    filter.userId = req.query.userId;
  }

  if (req.query.action) {
    filter.action = req.query.action;
  }

  const [logs, total] = await Promise.all([
    Audit.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Audit.countDocuments(filter)
  ]);

  res.json({
    logs,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });

});