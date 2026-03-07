import Customer from "../models/customer.model.js";
import cloudinary from "../config/cloudinary.js"
import asyncHandler from "../utils/asyncHandler.js";
import { cascadeDeleteCustomerServices } from "../utils/cascadeDeleteCustomer.js";
import { accessFilter } from "../utils/accessFilter.js";
import { logAction } from "../utils/auditLogger.js";

/* CREATE */
export const addCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.create({
    ...req.body,
    createdBy: req.user._id
  });

  await logAction({
    userId: req.user._id,
    action: "REGISTRATION",
    entity: "CUSTOMER",
    entityId: customer._id,
    details: `Customer ${customer.name} REGISTERED`
  });

  res.status(201).json(customer);
});

//GET A SINGLE CUSTOMER
// export const getSingleCustomer = asyncHandler(async (req, res) => {
//   const customer = await Customer.findById(req.params.id);
//   res.status(200).json(customer);
// });

export const getSingleCustomer = asyncHandler(async (req, res) => {
  // 1. Generate the filter based on the logged-in user's role
  const filter = accessFilter(req.user);

  // 2. Merge the ID into the filter
  // This ensures we look for the specific ID AND satisfy the role requirements
  const customer = await Customer.findOne({ 
    _id: req.params.id, 
    ...filter 
  }); 

  if (!customer) {
    // Better UX: Send 404 if not found or unauthorized via filter
    res.status(404);
    throw new Error("Customer not found or access expired");
  }

  res.status(200).json(customer);
});

/* GET ALL */
export const getCustomers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 20); // max 50
  const skip = (page - 1) * limit;

  const staffFilter = accessFilter(req.user);

  const filter = { ...staffFilter, isDeleted: false };

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .select("-documents")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Customer.countDocuments(filter)
  ]);

  res.json({
    customers,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});

//GET TRASH CUSTOMERS
export const getTrashCustomers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 20); // max 50
  const skip = (page - 1) * limit;

  const filter = { isDeleted: true };

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .sort({ createdAt: -1 })
      .select("-documents")
      .skip(skip)
      .limit(limit),
    Customer.countDocuments(filter)
  ]);

  res.json({
    customers,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});


/* SEARCH */
export const searchCustomer = asyncHandler(async (req, res) => {
  const { type, q, isDeleted } = req.query;

  const staffFilter = accessFilter(req.user);

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  let filter = { ...staffFilter, isDeleted: isDeleted === "true" };

  if (type === "name") filter.name = { $regex: q, $options: "i" };
  if (type === "mobile") filter.mobile = q;
  if (type === "aadhar") filter.aadhar = q;
  if (type === "address") filter.address = { $regex: q, $options: "i" };

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter)
  ]);

  res.json({
    customers,
    pagination: {
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    }
  });
});


// PATCH(UPDATE) /customers/:id
export const updateCustomerDetails = asyncHandler(async (req, res) => {
  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCustomer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.status(200).json(updatedCustomer);
});



/* SOFT DELETE */
export const softDeleteCustomer = asyncHandler(async (req, res) => {
  await Customer.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
    deletedAt: new Date()
  });
  res.json({ message: "Moved to trash" });
});

//BULK SOFT DELETE
export const bulkSoftDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No customer IDs provided" });
  }

  const result = await Customer.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date()
      }
    }
  );

  res.json({
    message: "Customers moved to trash",
    modifiedCount: result.modifiedCount
  });
});




/* RESTORE */
export const restoreCustomer = asyncHandler(async (req, res) => {
  await Customer.findByIdAndUpdate(req.params.id, {
    isDeleted: false,
    deletedAt: null
  });
  res.json({ message: "Customer restored" });
});

//BULK RESTORE
export const bulkRestore = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No customer IDs provided" });
  }

  const result = await Customer.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        isDeleted: false,
        deletedAt: null
      }
    }
  );

  res.json({
    message: "Customers restored",
    modifiedCount: result.modifiedCount
  });
});


/* PERMANENT DELETE */
export const permanentDeleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  for (const doc of customer.documents) {
    await cloudinary.uploader.destroy(doc.publicId,
      {
        resource_type: doc.resourceType
      });
  }
  await cascadeDeleteCustomerServices(customer._id);
  await customer.deleteOne();
  res.json({ message: "Customer permanently deleted" });
});


//BULK PERMANENT DELETE
export const bulkPermanentDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No customer IDs provided" });
  }

  const customers = await Customer.find({ _id: { $in: ids } });

  for (const customer of customers) {
    for (const doc of customer.documents) {
      if (doc.publicId) {
        await cloudinary.uploader.destroy(doc.publicId,
          {
            resource_type: doc.resourceType
          });
      }
    }
    await cascadeDeleteCustomerServices(customer._id);
  }

  const result = await Customer.deleteMany({ _id: { $in: ids } });

  res.json({
    message: "Customers permanently deleted",
    deletedCount: result.deletedCount
  });
});


//ADD DOCUMENT 
export const addDocument = asyncHandler(async (req, res) => {
  const { type, url, publicId, resourceType } = req.body;

  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  if (!["image", "raw"].includes(resourceType)) {
    return res.status(400).json({ message: "Invalid file type" });
  }


  customer.documents.push({
    type,
    url,
    publicId,
    resourceType,
    createdAt: new Date()
  });

  await customer.save();

  await logAction({
    userId: req.user._id,
    action: "UPLOAD",
    entity: "CUSTOMER DOCUMENT",
    entityId: customer._id,
    details: `${customer.name} ${type} UPLOADED `
  });

  res.json({
    message: "Document added successfully",
    documents: customer.documents
  });
});

//DELETE DOCUMENT
export const deleteDocument = asyncHandler(async (req, res) => {
  const { customerId, documentId } = req.params;

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const doc = customer.documents.id(documentId);
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
  await customer.save();

  res.json({ message: "Document deleted successfully" });
});
