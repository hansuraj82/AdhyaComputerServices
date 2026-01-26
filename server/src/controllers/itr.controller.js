import ITRService from "../models/itr.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";
import { decrypt } from "../utils/encrypt.js";
import Customer from "../models/customer.model.js";

/* CREATE ITR */
export const addITR = asyncHandler(async (req, res, next) => {
  const { panNumber, itrPassword, brokerId, customerId } = req.body;

  if (!panNumber || !itrPassword || !customerId) {
    const error = new Error("Missing required fields");
    error.statusCode = 400;
    throw error;
  }

  const itr = new ITRService({
    customerId,
    brokerId: brokerId || null,

    // store RAW here
    panEncrypted: panNumber,
    panLast4: panNumber.slice(-4),

    itrPassword // raw
  });

  await itr.save(); // 🔐 encrypted by schema hook

  res.status(201).json({
    message: "ITR created successfully",
    itr
  });
});


/* GET ITRs BY CUSTOMER */
export const getITRsByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const itrs = await ITRService.find({ customerId })
    .populate("brokerId", "name")
    .sort({ createdAt: -1 });

  for (const itr of itrs) {
    itr.panEncrypted = decrypt(itr.panEncrypted);
    itr.itrPassword = decrypt(itr.itrPassword);
  }

  res.json(itrs);
});

/* GET SINGLE ITR */
export const getSingleITR = asyncHandler(async (req, res) => {
  const itr = await ITRService.findById(req.params.id)
    .populate("customerId", "name mobile")
    .populate("brokerId", "name");

  if (!itr) {
    const error = new Error("ITR not found");
    error.statusCode = 404;
    throw error;
  }


  res.json(itr);
});

/* DELETE ITR */
export const deleteITR = asyncHandler(async (req, res) => {
  const itr = await ITRService.findById(req.params.id);

  if (!itr) {
    const error = new Error("ITR not found");
    error.statusCode = 404;
    throw error;
  }
  for (const doc of itr.documents) {
    if (doc.publicId) {
      await cloudinary.uploader.destroy(doc.publicId,
        {
          resource_type: doc.resourceType
        });
    }
  }

  await itr.deleteOne();
  res.json({ message: "ITR deleted successfully" });
});


/* UPDATE ITR */
export const updateITR = asyncHandler(async (req, res) => {
  const itr = await ITRService.findById(req.params.id);

  if (!itr) {
    const error = new Error("ITR not found");
    error.statusCode = 404;
    throw error;
  }

  if (req.body.panNumber) {
    itr.panEncrypted = req.body.panNumber;      // raw
    itr.panLast4 = req.body.panNumber.slice(-4);
  }

  if (req.body.itrPassword) {
    itr.itrPassword = req.body.itrPassword;     // raw
  }

  itr.brokerId = req.body.brokerId || null;
  await itr.save(); // 🔐 encrypted automatically

  res.json({
    message: "ITR updated successfully",
    itr
  });
});



//ADD DOCUMENT 
export const addDocument = asyncHandler(async (req, res) => {
  const { label, url, publicId, resourceType } = req.body;

  const itr = await ITRService.findById(req.params.id);
  if (!itr) {
    return res.status(404).json({ message: "itr not found" });
  }
  if (!["image", "raw"].includes(resourceType)) {
    return res.status(400).json({ message: "Invalid file type" });
  }


  itr.documents.push({
    label,
    url,
    publicId,
    resourceType,
    createdAt: new Date()
  });

  await itr.save();

  res.json({
    message: "Document added successfully",
    documents: itr.documents
  });
});


//DELETE DOCUMENT
export const deleteDocument = asyncHandler(async (req, res) => {
  const { itrId, documentId } = req.params;

  const itr = await ITRService.findById(itrId);
  if (!itr) {
    return res.status(404).json({ message: "itr not found" });
  }

  const doc = itr.documents.id(documentId);
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
  await itr.save();

  res.json({ message: "Document deleted successfully" });
});



/* GET ITRs BY CUSTOMER */
export const getAllITR = asyncHandler(async (req, res) => {
  // 1. Pagination Setup
  const page = Number(req.query.page) || 1; // Use req.query, not req.params
  const limit = 20;
  const skip = (page - 1) * limit;

  const q = (req.query.q || "").trim();
  const filter = {};

  // 2. Hybrid Search Logic
  if (q) {
    // Find customers matching Name or Mobile
    const customers = await Customer.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { mobile: { $regex: q } }
      ]
    }).select("_id");

    const customerIds = customers.map((c) => c._id);

    // Filter ITRs by PAN OR matching Customer IDs
    filter.$or = [
      { panNumber: { $regex: q, $options: "i" } }, // Assuming your field is panNumber
      { customerId: { $in: customerIds } }
    ];
  }

  // 3. Optimized Query
  const [itrs, total] = await Promise.all([
    ITRService.find(filter)
      .populate("brokerId", "name")
      .populate("customerId", "name mobile")
      .select("-documents -panEncrypted -itrPassword")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ITRService.countDocuments(filter)
  ]);

  res.json({
    itrs,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});