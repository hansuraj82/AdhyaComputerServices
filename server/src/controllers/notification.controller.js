import asyncHandler from "../utils/asyncHandler.js";
import PolicyService from "../models/policy.model.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const EXPIRING_DAYS = 7;
  const DAY_MS = 24 * 60 * 60 * 1000;

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + EXPIRING_DAYS);

  // Fetch relevant policies
  const policies = await PolicyService.find({
    archived: false,
    policyEndDate: { $lte: maxDate },
  })
    .populate("customerId", "name")
    .sort({ policyEndDate: 1 });

  const notifications = policies.map((policy) => {
    const endDate = new Date(policy.policyEndDate);
    endDate.setHours(0, 0, 0, 0);

    const diffMs = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / DAY_MS);

    // DETERMINING STATUS
    let type = "ACTIVE";
    if (daysLeft < 0) type = "EXPIRED";
    else if (daysLeft <= EXPIRING_DAYS) type = "EXPIRING";

    // SENIOR DEV LOGIC: SNOOZE CHECK
    // 1. Check if the field exists
    // 2. Check if the date is in the future compared to 'now'
    const isSnoozed = policy.notificationAcknowledgedUntil
      ? new Date(policy.notificationAcknowledgedUntil) > new Date()
      : false;

    return {
      type,
      isSnoozed, // New boolean for frontend filtering
      policyId: policy._id,
      policyNumber: policy.policyNumber,
      customerId: policy.customerId?._id,
      customerName: policy.customerId?.name,
      daysLeft,
      notificationAcknowledgedUntil: policy.notificationAcknowledgedUntil
    };
  });

  res.json({
    count: notifications.length,
    // Add summary counts to help the frontend badge icons
    summary: {
      urgent: notifications.filter(n => !n.isSnoozed).length,
      snoozed: notifications.filter(n => n.isSnoozed).length
    },
    notifications
  });
});


export const getNotificationsWithOutSnoozed = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const EXPIRING_DAYS = 7;
  const DAY_MS = 24 * 60 * 60 * 1000;

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + EXPIRING_DAYS);

  // Fetch only relevant policies (today → next 7 days)
  const policies = await PolicyService.find({
    archived: { $ne: true },
    policyEndDate: {
      $lte: maxDate
    },
    $or: [
      { notificationAcknowledgedUntil: null },
      { notificationAcknowledgedUntil: { $lt: today } }
    ]
  })
    .populate("customerId", "name")
    .sort({ policyEndDate: 1 });

  const notifications = policies.map((policy) => {
    const endDate = new Date(policy.policyEndDate);
    endDate.setHours(0, 0, 0, 0);

    const diffMs = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / DAY_MS);

    let type = "ACTIVE";
    if (daysLeft < 0) type = "EXPIRED";
    else if (daysLeft <= EXPIRING_DAYS) type = "EXPIRING";

    return {
      type,
      policyId: policy._id,
      policyNumber: policy.policyNumber,
      customerId: policy.customerId._id,
      customerName: policy.customerId.name,
      daysLeft: daysLeft
    };
  });

  res.json({
    count: notifications.length,
    notifications
  });
});


export const acknowledgePolicyNotification = asyncHandler(async (req, res) => {
  const { days = 2 } = req.body;

  const policy = await PolicyService.findById(req.params.id);
  if (!policy) {
    const error = new Error("Policy not found");
    error.statusCode = 404;
    throw error;
  }

  const until = new Date();
  until.setDate(until.getDate() + days);

  policy.notificationAcknowledgedUntil = until;
  await policy.save();

  res.json({
    message: `Reminder snoozed for ${days} days`
  });
});
