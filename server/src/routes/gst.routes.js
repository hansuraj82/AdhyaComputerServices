import express from "express";
import protect from "../middleware/auth.middleware.js";
import { addDocument, addGST, deleteDocument, deleteGST, getAllGST, getGSTByCustomer, getSingleGST, updateGST } from "../controllers/gst.controller.js";

const router = express.Router();

router.post("/", protect, addGST);
router.get("/customer/:customerId", protect, getGSTByCustomer);
router.get("/allGST", protect, getAllGST);
router.get("/:id", protect, getSingleGST);
router.delete("/:id", protect, deleteGST);
router.put("/:id", protect, updateGST);
router.post("/:id/documents", protect, addDocument);
router.delete("/:gstId/documents/:documentId", protect, deleteDocument);


export default router;
