import { asyncHandler } from "../utils/asyncHandler.js";
import { handleSuccessResponse, throwAPIError } from "../utils/lib.js";
import { Lead } from "../models/Lead.js";

const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, status } = req.body;
  await Lead.create({ name, email, phone, status });
  handleSuccessResponse(res, 201, {}, "Lead created successfully");
});

const updateLeadStatus = asyncHandler(async (req, res) => {
  const { leadId } = req.query;
  const { status } = req.body;
  const lead = await Lead.findById(leadId);
  lead.status = status;
  await lead.save();
  handleSuccessResponse(res, 200, {}, "Lead status updated successfully");
});

const listLeads = asyncHandler(async (req, res) => {
  const leads = await Lead.find();
  console.log("Listing leads \n", leads);
  handleSuccessResponse(res, 200, { leads }, "Leads retrieved successfully");
});

const searchLeads = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return handleSuccessResponse(res, 200, { leads: [] }, "Leads retrieved successfully");
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escapeRegex(query), "i");

  const leads = await Lead.find({
    $or: [
      { name: regex },
      { email: regex },
      { phone: regex },
    ],
  });

  handleSuccessResponse(res, 200, { leads }, "Leads retrieved successfully");
});

export { createLead, updateLeadStatus, listLeads, searchLeads };
