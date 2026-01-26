import Broker from "../models/broker.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import PolicyService from "../models/policy.model.js";
import ITRService from "../models/itr.model.js";
import GSTService from "../models/gst.model.js";

/* CREATE BROKER */
export const addBroker = asyncHandler(async (req, res) => {
  const { name, mobile } = req.body;

  const broker = await Broker.create({
    name,
    mobile
  });

  res.status(201).json(broker);
});

/* UPDATE BROKER */
export const updateBroker = asyncHandler(async (req, res) => {
  const broker = await Broker.findById(req.params.id);

  if (!broker) {
    const error = new Error("Broker not found");
    error.statusCode = 404;
    throw error;
  }

  broker.name = req.body.name ?? broker.name;
  broker.mobile = req.body.mobile ?? broker.mobile;

  await broker.save();

  res.json({
    message: "Broker updated successfully",
    broker
  });
});

/* ENABLE BROKER */
export const enableBroker = asyncHandler(async (req, res) => {
  const broker = await Broker.findById(req.params.id);

  if (!broker) {
    const error = new Error("Broker not found");
    error.statusCode = 404;
    throw error;
  }

  broker.isActive = true;
  await broker.save();

  res.json({
    message: "Broker enabled successfully"
  });
});

/* DISABLE BROKER */
export const disableBroker = asyncHandler(async (req, res) => {
  const broker = await Broker.findById(req.params.id);

  if (!broker) {
    const error = new Error("Broker not found");
    error.statusCode = 404;
    throw error;
  }

  broker.isActive = false;
  await broker.save();

  res.json({
    message: "Broker disabled successfully"
  });
});

/* GET ALL  BROKERS */
export const getBrokers = asyncHandler(async (req, res) => {
  const brokers = await Broker.find()
    .sort({ name: 1 });

  res.json(brokers);
});

/* GET ALL ACTIVE BROKERS */
export const getActiveBrokers = asyncHandler(async (req, res) => {
  const brokers = await Broker.find({ isActive: true })
    .sort({ name: 1 });

  res.json(brokers);
});


export const getBrokerSummary = asyncHandler(async (req, res) => {
  const brokers = await Broker.find().sort({ createdAt: -1 });

  const brokerIds = brokers.map((b) => b._id);

  const [policyCounts, itrCounts, gstCounts] = await Promise.all([
    PolicyService.aggregate([
      { $match: { brokerId: { $in: brokerIds } } },
      { $group: { _id: "$brokerId", count: { $sum: 1 } } }
    ]),
    ITRService.aggregate([
      { $match: { brokerId: { $in: brokerIds } } },
      { $group: { _id: "$brokerId", count: { $sum: 1 } } }
    ]),
    GSTService.aggregate([
      { $match: { brokerId: { $in: brokerIds } } },
      { $group: { _id: "$brokerId", count: { $sum: 1 } } }
    ])
  ]);

  // convert to maps for easy lookup
  const policyMap = Object.fromEntries(
    policyCounts.map((x) => [String(x._id), x.count])
  );
  const itrMap = Object.fromEntries(
    itrCounts.map((x) => [String(x._id), x.count])
  );
  const gstMap = Object.fromEntries(
    gstCounts.map((x) => [String(x._id), x.count])
  );

  const result = brokers.map((b) => ({
    ...b._doc,
    policyCount: policyMap[String(b._id)] || 0,
    itrCount: itrMap[String(b._id)] || 0,
    gstCount: gstMap[String(b._id)] || 0,
    totalWork:
      (policyMap[String(b._id)] || 0) +
      (itrMap[String(b._id)] || 0) +
      (gstMap[String(b._id)] || 0)
  }));

  res.json(result);
});


export const getBrokerWork = asyncHandler(async (req, res) => {
  const { brokerId } = req.params;
  const type = (req.query.type || "policy").toLowerCase();

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 20);
  const skip = (page - 1) * limit;

  const from = req.query.from; // "YYYY-MM-DD"
  const to = req.query.to;     // "YYYY-MM-DD"

  let Model;
  if (type === "policy") Model = PolicyService;
  else if (type === "itr") Model = ITRService;
  else if (type === "gst") Model = GSTService;
  else {
    const error = new Error("Invalid type");
    error.statusCode = 400;
    throw error;
  }

  const filter = { brokerId };

  // ✅ Add Date filter (createdAt based)
  if (from || to) {
    filter.createdAt = {};

    if (from) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      filter.createdAt.$gte = fromDate;
    }

    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = toDate;
    }
  }

  const [records, total] = await Promise.all([
    Model.find(filter)
      .populate("customerId", "name mobile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Model.countDocuments(filter)
  ]);

  res.json({
    type,
    records,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});
