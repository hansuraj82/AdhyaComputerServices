import express from "express";
import protect from "../middleware/auth.middleware.js";
import { addDocument, addPolicy, archivePolicy, deleteDocument, deletePolicy, getAllPolicies, getPoliciesByCustomer, getSinglePolicy, updatePolicy } from "../controllers/policy.controller.js";

const router = express.Router();

router.post("/", protect, addPolicy);
router.get("/customer/:customerId", protect, getPoliciesByCustomer);
router.get("/allPolicy", protect, getAllPolicies);
router.get("/:id", protect, getSinglePolicy);
router.delete("/:id", protect, deletePolicy);
router.put("/:id", protect, updatePolicy);
router.post("/:id/documents", protect, addDocument);
router.put("/:id/archive", protect, archivePolicy);
router.delete("/:policyId/documents/:documentId", protect, deleteDocument);



export default router;
