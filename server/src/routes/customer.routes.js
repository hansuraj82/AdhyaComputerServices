import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  addCustomer,
  getCustomers,
  searchCustomer,
  softDeleteCustomer,
  restoreCustomer,
  permanentDeleteCustomer,
  bulkSoftDelete,
  bulkRestore,
  bulkPermanentDelete,
  getTrashCustomers,
  addDocument,
  deleteDocument,
  getSingleCustomer,
  updateCustomerDetails
} from "../controllers/customer.controller.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();
router.use(protect);

router.post("/", addCustomer);
router.get("/", getCustomers);
router.get("/customer/:id", getSingleCustomer);
router.patch("/customer/:id", authorize("owner"), updateCustomerDetails)
router.get("/trash", authorize("owner"), getTrashCustomers);
router.get("/search", searchCustomer);
router.put("/:id/trash", authorize("owner"), softDeleteCustomer);
router.put("/:id/restore", authorize("owner"), restoreCustomer);
router.delete("/:id/permanent", authorize("owner"), permanentDeleteCustomer);
router.put("/bulk-trash", authorize("owner"), bulkSoftDelete);
router.put("/bulk-restore", authorize("owner"), bulkRestore);
router.post("/bulk-permanent", authorize("owner"), bulkPermanentDelete);
router.post("/:id/documents", addDocument);
router.delete("/:customerId/documents/:documentId", authorize("owner"), deleteDocument);


export default router;
