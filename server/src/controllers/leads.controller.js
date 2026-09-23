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

const getLeadsMetrics = asyncHandler(async (req, res) => {
  const [metrics] = await Lead.aggregate([
    {
      $facet: {
        statusCounts: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
        totalLeads: [{ $count: "count" }],
      },
    },
  ]);

  const statusMap = {
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Disqualified: 0,
    Converted: 0,
  };

  metrics?.statusCounts?.forEach((item) => {
    if (item._id in statusMap) {
      statusMap[item._id] = item.count;
    }
  });

  const totalInflow = metrics?.totalLeads[0]?.count || 0;
  const totalProcessed = statusMap.Converted + statusMap.Disqualified;

  const conversionRateRaw = totalProcessed > 0 
    ? (statusMap.Converted / totalProcessed) * 100 
    : 0;

  const disqualificationRateRaw = totalProcessed > 0 
    ? (statusMap.Disqualified / totalProcessed) * 100 
    : 0;


  const newLeadsPct = totalInflow > 0 ? (statusMap.New / totalInflow) * 100 : 0;
  const activePipelineTotal = statusMap.Contacted + statusMap.Qualified;
  const activePipelinePct = totalInflow > 0 ? (activePipelineTotal / totalInflow) * 100 : 0;

  const cards = {
    totalInflow: {
      title: "Total Leads Inflow",
      displayValue: totalInflow.toFixed(2), 
      subValue: `New: ${statusMap.New.toFixed(2)}`,
      raw: {
        percentage: Number(newLeadsPct.toFixed(2)),
        total: totalInflow,
      },
    },
    activePipeline: {
      title: "Active Pipeline",
      displayValue: activePipelineTotal.toFixed(2), 
      subValue: `Contacted: ${statusMap.Contacted.toFixed(2)} | Qualified: ${statusMap.Qualified.toFixed(2)}`,
      raw: {
        percentage: Number(activePipelinePct.toFixed(2)),
        total: activePipelineTotal,
      },
    },
    conversionRate: {
      title: "Conversion Rate",
      displayValue: `${conversionRateRaw.toFixed(2)}%`, 
      subValue: `Converted: ${statusMap.Converted.toFixed(2)}`,
      raw: {
        percentage: Number(conversionRateRaw.toFixed(2)),
        total: statusMap.Converted,
      },
    },
    disqualificationRate: {
      title: "Disqualification Rate",
      displayValue: `${disqualificationRateRaw.toFixed(2)}%`,
      subValue: `Disqualified: ${statusMap.Disqualified.toFixed(2)}`,
      raw: {
        percentage: Number(disqualificationRateRaw.toFixed(2)),
        total: statusMap.Disqualified,
      },
    },
  };

  handleSuccessResponse(
    res,
    200,
    { metrics: cards },
    "Dashboard metrics retrieved successfully"
  );
});

export { createLead, updateLeadStatus, listLeads, searchLeads, getLeadsMetrics };