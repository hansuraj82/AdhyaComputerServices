import GSTService from "../models/gst.model.js";
import cloudinary from "../config/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import { decrypt } from "../utils/encrypt.js";

/* CREATE GST */
export const addGST = asyncHandler(async (req, res) => {
  const { gstNumber, filingFrequency, brokerId, customerId, gstId, gstPassword } = req.body;

  if (!gstNumber || !filingFrequency || !customerId || !gstPassword || !gstId) {
    const error = new Error("Missing required fields");
    error.statusCode = 400;
    throw error;
  }
  const gst = await GSTService.create({ gstNumber, filingFrequency, customerId, brokerId: brokerId || null, gstPassword, gstId });
  res.status(201).json(gst);
});

/* GET GST BY CUSTOMER */
export const getGSTByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const gstRecords = await GSTService.find({ customerId })
    .populate("brokerId", "name")
    .sort({ createdAt: -1 });
  for (const gst of gstRecords) {
    gst.gstId = decrypt(gst.gstId);
    gst.gstPassword = decrypt(gst.gstPassword);
  }

  res.json(gstRecords);
});

/* GET SINGLE GST */
export const getSingleGST = asyncHandler(async (req, res) => {
  const gst = await GSTService.findById(req.params.id)
    .populate("customerId", "name mobile")
    .populate("brokerId", "name");

  if (!gst) {
    const error = new Error("GST record not found");
    error.statusCode = 404;
    throw error;
  }

  res.json(gst);
});

/* DELETE GST */
export const deleteGST = asyncHandler(async (req, res) => {
  const gst = await GSTService.findById(req.params.id);

  if (!gst) {
    const error = new Error("GST record not found");
    error.statusCode = 404;
    throw error;
  }
  for (const doc of gst.documents) {
    if (doc.publicId) {
      await cloudinary.uploader.destroy(doc.publicId,
        {
          resource_type: doc.resourceType
        });
    }
  }

  await gst.deleteOne();
  res.json({ message: "GST record deleted successfully" });
});

/* UPDATE GST */
export const updateGST = asyncHandler(async (req, res) => {
  const gst = await GSTService.findById(req.params.id);

  if (!gst) {
    const error = new Error("GST record not found");
    error.statusCode = 404;
    throw error;
  }

  gst.gstNumber = req.body.gstNumber ?? gst.gstNumber;
  gst.filingFrequency = req.body.filingFrequency ?? gst.filingFrequency;
  gst.gstId = req.body.gstId ?? gst.gstId;
  gst.gstPassword = req.body.gstPassword ?? gst.gstPassword;

  if (req.body.hasOwnProperty('brokerId')) {
    gst.brokerId = (req.body.brokerId && req.body.brokerId !== "undefined") ? req.body.brokerId : null;
  }

  await gst.save();

  res.json({
    message: "GST updated successfully",
    gst
  });
});


//ADD DOCUMENT 
export const addDocument = asyncHandler(async (req, res) => {
  const { label, url, publicId, resourceType } = req.body;

  const gst = await GSTService.findById(req.params.id);
  if (!gst) {
    return res.status(404).json({ message: "gst not found" });
  }
  if (!["image", "raw"].includes(resourceType)) {
    return res.status(400).json({ message: "Invalid file type" });
  }


  gst.documents.push({
    label,
    url,
    publicId,
    resourceType,
    createdAt: new Date()
  });

  await gst.save();

  res.json({
    message: "Document added successfully",
    documents: gst.documents
  });
});


//DELETE DOCUMENT
export const deleteDocument = asyncHandler(async (req, res) => {
  const { gstId, documentId } = req.params;

  const gst = await GSTService.findById(gstId);
  if (!gst) {
    return res.status(404).json({ message: "gst not found" });
  }

  const doc = gst.documents.id(documentId);
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
  await gst.save();

  res.json({ message: "Document deleted successfully" });
});


export const getAllGST = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const q = (req.query.q || "").trim();
  const filter = {};

  // ✅ Search ONLY GST Number (Fastest performance)
  if (q) {
    filter.gstNumber = { $regex: q, $options: "i" };
  }

  const [gstRecords, total] = await Promise.all([
    GSTService.find(filter)
      .populate("customerId", "name mobile") // Still get the names for the UI
      .select("-documents -gstId -gstPassword -brokerId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    GSTService.countDocuments(filter)
  ]);

  res.json({
    gstRecords,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});