import express from "express";
import protect from "../middleware/auth.middleware.js";
import { addDocument, addITR, deleteDocument, deleteITR, getAllITR, getITRsByCustomer, getSingleITR, updateITR } from "../controllers/itr.controller.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/", protect, addITR);
router.get("/customer/:customerId", protect, getITRsByCustomer);
router.get("/allITR", protect, authorize("owner"), getAllITR);
router.get("/:id", protect, authorize("owner"), getSingleITR);
router.delete("/:id", protect, authorize("owner"), deleteITR);
router.put("/:id", protect, authorize("owner"), updateITR);
router.post("/:id/documents", protect, addDocument);
router.delete("/:itrId/documents/:documentId", protect, authorize("owner"), deleteDocument);


export default router;
