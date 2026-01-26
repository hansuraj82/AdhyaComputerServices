import PolicyService from "../models/policy.model.js";
import cloudinary from "../config/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

/* CREATE POLICY */
export const addPolicy = asyncHandler(async (req, res) => {
  const { customerId, brokerId, policyNumber, policyStartDate, policyEndDate } = req.body;
  const policy = await PolicyService.create({
    customerId,
    brokerId: brokerId || null,
    policyNumber,
    policyStartDate,
    policyEndDate
  });
  res.status(201).json(policy);
});

/* GET POLICIES BY CUSTOMER (WITH EXPIRY STATUS) */
export const getPoliciesByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const policies = await PolicyService.find({ customerId })
    .populate("brokerId", "name")
    .sort({ policyEndDate: 1 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = policies.map((policy) => {
    const endDate = new Date(policy.policyEndDate);
    endDate.setHours(0, 0, 0, 0);

    const diffMs = endDate.getTime() - today.getTime();

    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let status = "ACTIVE";
    if (daysLeft < 0) status = "EXPIRED";
    else if (daysLeft <= 7) status = "EXPIRING";

    return {
      ...policy._doc,
      daysLeft: daysLeft, // prevent negative days
      status
    };
  });


  res.json(result);
});

/* GET SINGLE POLICY */
export const getSinglePolicy = asyncHandler(async (req, res) => {
  const policy = await PolicyService.findById(req.params.id)
    .populate("customerId", "name mobile")
    .populate("brokerId", "name");

  if (!policy) {
    const error = new Error("Policy not found");
    error.statusCode = 404;
    throw error;
  }

  res.json(policy);
});

/* DELETE POLICY */
export const deletePolicy = asyncHandler(async (req, res) => {
  const policy = await PolicyService.findById(req.params.id);

  if (!policy) {
    const error = new Error("Policy not found");
    error.statusCode = 404;
    throw error;
  }

  for (const doc of policy.documents) {
    if (doc.publicId) {
      await cloudinary.uploader.destroy(doc.publicId,
        {
          resource_type: doc.resourceType
        });
    }
  }

  await policy.deleteOne();
  res.json({ message: "Policy deleted successfully" });
});



/* UPDATE POLICY */
export const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await PolicyService.findById(req.params.id);

  if (!policy) {
    const error = new Error("Policy not found");
    error.statusCode = 404;
    throw error;
  }

  policy.policyNumber = req.body.policyNumber ?? policy.policyNumber;
  policy.policyStartDate = req.body.policyStartDate ?? policy.policyStartDate;
  policy.policyEndDate = req.body.policyEndDate ?? policy.policyEndDate;
  policy.brokerId = req.body.brokerId || null

  await policy.save();

  res.json({
    message: "Policy updated successfully",
    policy
  });
});

export const archivePolicy = asyncHandler(async (req, res) => {
  const policy = await PolicyService.findByIdAndUpdate(req.params.id, {
    archived: true
  });
  res.json({ message: "Policy Archived Successfully" })

})


//ADD DOCUMENT 
export const addDocument = asyncHandler(async (req, res) => {
  const { label, url, publicId, resourceType } = req.body;

  const policy = await PolicyService.findById(req.params.id);
  if (!policy) {
    return res.status(404).json({ message: "PolicyService not found" });
  }
  if (!["image", "raw"].includes(resourceType)) {
    return res.status(400).json({ message: "Invalid file type" });
  }


  policy.documents.push({
    label,
    url,
    publicId,
    resourceType,
    createdAt: new Date()
  });

  await policy.save();

  res.json({
    message: "Document added successfully",
    documents: policy.documents
  });
});


//DELETE DOCUMENT
export const deleteDocument = asyncHandler(async (req, res) => {
  const { policyId, documentId } = req.params;

  const policy = await PolicyService.findById(policyId);
  if (!policy) {
    return res.status(404).json({ message: "Policy not found" });
  }

  const doc = policy.documents.id(documentId);
  if (!doc) {
    return res.status(404).json({ message: "Document not found" });
  }

  // delete from cloudinary
  if (doc.publicId) {
    await cloudinary.uploader.destroy(doc.publicId, {
      resource_type: doc.resourceType
    });
  }

  doc.deleteOne();
  await policy.save();

  res.json({ message: "Document deleted successfully" });
});


export const getAllPolicies = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 30);
  const skip = (page - 1) * limit;

  const status = (req.query.status || "").toLowerCase();
  let archivedQuery = req.query.archived; // "true" | "false" | undefined



  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const EXPIRING_DAYS = 7;
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + EXPIRING_DAYS);

  // ✅ base filter
  const filter = {};

  // archived filter
  if (archivedQuery === "true") filter.archived = true;
  else if (archivedQuery === "false") filter.archived = { $ne: true };
  else filter.archived = { $ne: true }; // default: hide archived

  // ✅ status filter
  if (status === "active") {
    filter.policyEndDate = { $gt: maxDate };
  } else if (status === "expiring") {
    filter.policyEndDate = { $gte: today, $lte: maxDate };
  } else if (status === "expired") {
    filter.policyEndDate = { $lt: today };
  }

  const [policies, total] = await Promise.all([
    PolicyService.find(filter)
      .populate("brokerId", "name")
      .populate("customerId", "name mobile")
      .select("-documents")
      .sort({ policyEndDate: 1 })
      .skip(skip)
      .limit(limit),
    PolicyService.countDocuments(filter)
  ]);

  // ✅ Add derived status & daysLeft
  const formattedPolicies = policies.map((policy) => {
    const endDate = new Date(policy.policyEndDate);
    endDate.setHours(0, 0, 0, 0);

    const diffMs = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let computedStatus = "ACTIVE";
    if (daysLeft < 0) computedStatus = "EXPIRED";
    else if (daysLeft <= EXPIRING_DAYS) computedStatus = "EXPIRING";

    return {
      ...policy._doc,
      daysLeft: daysLeft,
      status: policy.archived ? "ARCHIVED" : computedStatus
    };
  });

  res.json({
    policies: formattedPolicies,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});
