import PolicyService from "../models/policy.model.js";
import ITRService from "../models/itr.model.js";
import GSTService from "../models/gst.model.js";
import cloudinary from "../config/cloudinary.js";

/**
 * Delete all services & their documents for a customer
 */
export const cascadeDeleteCustomerServices = async (customerId) => {
  // 1️⃣ POLICIES
  const policies = await PolicyService.find({ customerId });

  for (const policy of policies) {
    for (const doc of policy.documents || []) {
      if (doc.publicId) {
        await cloudinary.uploader.destroy(doc.publicId, {
          resource_type: doc.resourceType
        });
      }
    }
  }

  await PolicyService.deleteMany({ customerId });

  // 2️⃣ ITR
  const itrs = await ITRService.find({ customerId });

  for (const itr of itrs) {
    for (const doc of itr.documents || []) {
      if (doc.publicId) {
        await cloudinary.uploader.destroy(doc.publicId, {
          resource_type: doc.resourceType
        });
      }
    }
  }

  await ITRService.deleteMany({ customerId });

  // 3️⃣ GST
  const gsts = await GSTService.find({ customerId });

  for (const gst of gsts) {
    for (const doc of gst.documents || []) {
      if (doc.publicId) {
        await cloudinary.uploader.destroy(doc.publicId, {
          resource_type: doc.resourceType
        });
      }
    }
  }

  await GSTService.deleteMany({ customerId });
};
