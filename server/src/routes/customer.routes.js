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

const router = express.Router();
router.use(protect);

router.post("/", addCustomer);
router.get("/", getCustomers);
router.get("/customer/:id",getSingleCustomer);
router.patch("/customer/:id",updateCustomerDetails)
router.get("/trash",getTrashCustomers);
router.get("/search", searchCustomer);
router.put("/:id/trash", softDeleteCustomer);
router.put("/:id/restore", restoreCustomer);
router.delete("/:id/permanent", permanentDeleteCustomer);
router.put("/bulk-trash", bulkSoftDelete);
router.put("/bulk-restore", bulkRestore);
router.post("/bulk-permanent", bulkPermanentDelete);
router.post("/:id/documents", addDocument);
router.delete("/:customerId/documents/:documentId", deleteDocument);


export default router;
