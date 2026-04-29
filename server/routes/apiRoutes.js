const express = require("express");

const { getHealth } = require("../controllers/healthController");
const { extractJudgment } = require("../controllers/extractController");
const { generateActionPlan } = require("../controllers/actionPlanController");
const { extractPdfTextWithOcr } = require("../controllers/ocrController");
const { upload } = require("../middleware/uploadMiddleware");
const {
  validateExtractPayload,
  validateActionPlanPayload,
} = require("../middleware/validateRequest");

const router = express.Router();

router.get("/health", getHealth);
router.post("/extract", validateExtractPayload, extractJudgment);
router.post("/action-plan", validateActionPlanPayload, generateActionPlan);
router.post("/ocr", upload.single("file"), extractPdfTextWithOcr);

module.exports = router;
