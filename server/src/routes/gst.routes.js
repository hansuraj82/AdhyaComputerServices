import express from "express";
import protect from "../middleware/auth.middleware.js";
import { addDocument, addGST, deleteDocument, deleteGST, getAllGST, getGSTByCustomer, getSingleGST, updateGST } from "../controllers/gst.controller.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.post("/", protect, addGST);
router.get("/customer/:customerId", protect, getGSTByCustomer);
router.get("/allGST", protect, authorize("owner"), getAllGST);
router.get("/:id", protect, authorize("owner"), getSingleGST);
router.delete("/:id", protect, authorize("owner"), deleteGST);
router.put("/:id", protect, authorize("owner"), updateGST);
router.post("/:id/documents", protect, addDocument);
router.delete("/:gstId/documents/:documentId", protect, authorize("owner"), deleteDocument);


export default router;
