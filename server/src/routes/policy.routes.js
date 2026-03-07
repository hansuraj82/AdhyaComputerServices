import express from "express";
import protect from "../middleware/auth.middleware.js";
import { addDocument, addPolicy, archivePolicy, deleteDocument, deletePolicy, getAllPolicies, getPoliciesByCustomer, getSinglePolicy, updatePolicy } from "../controllers/policy.controller.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/", protect, addPolicy);
router.get("/customer/:customerId", protect, getPoliciesByCustomer);
router.get("/allPolicy", protect, authorize("owner"), getAllPolicies);
router.get("/:id", protect, authorize("owner"), getSinglePolicy);
router.delete("/:id", protect, authorize("owner"), deletePolicy);
router.put("/:id", protect, authorize("owner"), updatePolicy);
router.post("/:id/documents", protect, addDocument);
router.put("/:id/archive", protect, authorize("owner"), archivePolicy);
router.delete("/:policyId/documents/:documentId", protect, authorize("owner"), deleteDocument);



export default router;
