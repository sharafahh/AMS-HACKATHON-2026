import express from "express";
import {
  generateCertificate,
  searchCertificates,
  verifyCertificate,
  deleteCertificate,
} from "../controllers/certificateController.js";

const router = express.Router();

router.post("/generate", generateCertificate);
router.get("/search", searchCertificates);
router.get("/verify/:code", verifyCertificate);
router.delete("/:id", deleteCertificate);

export default router;
