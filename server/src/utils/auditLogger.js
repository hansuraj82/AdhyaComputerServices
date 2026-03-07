import Audit from "../models/audit.model.js";

export const logAction = async ({
  userId,
  action,
  entity,
  entityId,
  details
}) => {
  try {
    await Audit.create({
      userId,
      action,
      entity,
      entityId,
      details
    });
  } catch (error) {
    console.error("Audit log failed:", error.message);
  }
};