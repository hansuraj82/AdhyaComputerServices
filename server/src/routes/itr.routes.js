import express from "express";
import protect from "../middleware/auth.middleware.js";
import { addDocument, addITR, deleteDocument, deleteITR, getAllITR, getITRsByCustomer, getSingleITR, updateITR } from "../controllers/itr.controller.js";

const router = express.Router();

router.post("/", protect, addITR);
router.get("/customer/:customerId", protect, getITRsByCustomer);
router.get("/allITR", protect, getAllITR);
router.get("/:id", protect, getSingleITR);
router.delete("/:id", protect, deleteITR);
router.put("/:id", protect, updateITR);
router.post("/:id/documents", protect, addDocument);
router.delete("/:itrId/documents/:documentId", protect, deleteDocument);


export default router;
