import { Router } from "express";
import {
  createLead,
  updateLeadStatus,
  listLeads,
  searchLeads,
  getLeadsMetrics,
} from "../controllers/leads.controller.js";
import {
  createLeadSchema,
  searchLeadsSchema,
  updateLeadStatusSchema,
} from "../validators/lead.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/create", validate(createLeadSchema), createLead);
router.get("/list", listLeads);
router.patch("/update-status", validate(updateLeadStatusSchema), updateLeadStatus);
router.get("/search", validate(searchLeadsSchema), searchLeads);
router.get("/metrics", getLeadsMetrics);

export default router;
