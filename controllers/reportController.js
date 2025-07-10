import {
  executeStoredProc,
  saveToMongoDB,
  updateJobStatuses,
} from "../utils/dbUtils.js";

import totalProfitModel from "../models/admin/reports/total-profit.model.js";
import jobStatusModel from "../models/admin/reports/job-status.model.js";
import emptyContainerModel from "../models/admin/reports/empty-container.model.js";
import clientInvoiceModel from "../models/admin/reports/client-invoice.model.js";
import ongoingJobModel from "../models/admin/reports/ongoing-job.model.js";

// Define the stored procedure names
const procedures = [
  { name: "__ClientsInvoiceReport_to_JSON", collection: "clientinvoices" },
  { name: "__Empty_Containers_to_JSON", collection: "emptycontainers" },
  { name: "__Total_Profit_to_JSON", collection: "totalprofits" },
  { name: "__Job_Status_to_JSON", collection: "jobstatus" },
  { name: "__Job_Status_FullPaid_to_JSON", collection: "jobstatus" },
  { name: "__OngoingJobs_Status_to_JSON", collection: "ongoingjobs" },
];

export const totalProfitReport = async (req, res) => {
  try {
    // Extract query parameters for filtering and sorting
    // Example: /api/reports/total-profit?
    //              status=active&sortBy="createdAt"&sortOrder=desc
    //              page=1&limit=10&fullPaid=true
    //              fullPaid is optional, if provided it will filter by fullPaid status
    //              statusType & departmentId & jobType

    const {
      status,
      sortBy,
      sortOrder,
      page,
      limit,
      fullPaid,
      statusType,
      departmentId,
      jobType,
    } = req.query;

    let filter = {};

    if (status) {
      filter.StatusType = status;
    }

    // Create sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await totalProfitModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const totalProfits = await totalProfitModel.find(filter).sort(sortOptions);

    // Calculate total profit by summing the TotalProfit field from all records
    const sumOfTotalProfit = totalProfits.reduce((sum, job) => {
      // Add the TotalProfit value if it exists and is a number, otherwise add 0
      return sum + (job.TotalProfit && !isNaN(job.TotalProfit) ? job.TotalProfit : 0);
    }, 0);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: totalProfits.length,
      total: totalCount,
      data: totalProfits,
      sumOfTotalProfit: sumOfTotalProfit,
    });
  } catch (error) {
    console.error("Error fetching total profits:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const jobStatusReport = async (req, res) => {
  try {
    const {
      status,
      sortBy,
      sortOrder,
      page,
      limit,
      fullPaid,
      statusType,
      departmentId,
      jobType,
    } = req.query;

    let filter = {};

    // Apply filters based on query parameters
    if (fullPaid === "true") {
      filter.FullPaid = true;
    } else if (fullPaid === "false") {
      filter.FullPaid = false;
    }
    if (status) {
      filter.Status = status;
    }

    if (statusType) {
      filter.StatusType = statusType;
    }

    if (departmentId) {
      filter.DepartmentId = departmentId;
    }
    if (jobType) {
      filter.JobType = jobType;
    }
    
    // Create sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await jobStatusModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const jobStatus = await jobStatusModel.find(filter).sort(sortOptions);
    
    // Calculate total profit by summing the TotalProfit field from all records
    const totalProfit = jobStatus.reduce((sum, job) => {
      // Add the TotalProfit value if it exists and is a number, otherwise add 0
      return sum + (job.TotalProfit && !isNaN(job.TotalProfit) ? job.TotalProfit : 0);
    }, 0);

    // Return response with all records and total profit
    res.status(200).json({
      success: true,
      count: jobStatus.length,
      total: totalCount,
      data: jobStatus,
      totalProfit: totalProfit,
    });
  } catch (error) {
    console.error("Error fetching job Status:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const emptyContainerReport = async (req, res) => {
  try {
    const {
      departmentId,
      status,
      sortBy,
      sortOrder,
      page,
      limit,
      fullPaid,
      statusType,
      jobType,
    } = req.query;

    let filter = {};

    if (departmentId) {
      filter.DepartmentId = departmentId;
    }
    if (jobType) {
      filter.JobType = jobType;
    }
    
    // Apply filters based on query parameters
    if (fullPaid === "true") {
      filter.FullPaid = true;
    } else if (fullPaid === "false") {
      filter.FullPaid = false;
    }

    if (status) {
      filter.StatusType = status;
    }

    // Create sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await emptyContainerModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const emptyContainers = await emptyContainerModel
      .find(filter)
      .sort(sortOptions);

    // Calculate total profit by summing the TotalProfit field from all records
    const totalProfit = emptyContainers.reduce((sum, job) => {
      // Add the TotalProfit value if it exists and is a number, otherwise add 0
      return sum + (job.TotalProfit && !isNaN(job.TotalProfit) ? job.TotalProfit : 0);
    }, 0);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: emptyContainers.length,
      total: totalCount,
      data: emptyContainers,
      totalProfit: totalProfit,
    });
  } catch (error) {
    console.error("Error fetching empty containers:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const clientInvoiceReport = async (req, res) => {
  try {
    const { status, sortBy, sortOrder } = req.query;

    let filter = {};

    if (status) {
      filter.StatusType = status;
    }

    // Create sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await clientInvoiceModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const clientInvoices = await clientInvoiceModel
      .find(filter)
      .sort(sortOptions);

    // Calculate total profit by summing the TotalCosts field from all records
    const sumOfTotalProfit = clientInvoices.reduce((sum, job) => {
      // Add the TotalProfit value if it exists and is a number, otherwise add 0
      return sum + (job.TotalProfit && !isNaN(job.TotalProfit) ? job.TotalProfit : 0);
    }, 0);

    const sumOfTotalInvoices = clientInvoices.reduce((sum, job) => {
      // Add the TotalProfit value if it exists and is a number, otherwise add 0
      return sum + (job.TotalInvoices && !isNaN(job.TotalInvoices) ? job.TotalInvoices : 0);
    }, 0);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: clientInvoices.length,
      total: totalCount,
      data: clientInvoices,
      sumOfTotalProfit: sumOfTotalProfit,
      sumOfTotalInvoices: sumOfTotalInvoices,
    });
  } catch (error) {
    console.error("Error fetching Client Invoices:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const ongoingJobsReport = async (req, res) => {
  try {
    const { status, sortBy, sortOrder } = req.query;

    let filter = {};

    if (status) {
      filter.StatusType = status;
    }

    // Create sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await ongoingJobModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const ongoingJobs = await ongoingJobModel.find(filter).sort(sortOptions);

    const sumOfTotalProfit = ongoingJobs.reduce((sum, job) => {
      // Add the TotalProfit value if it exists and is a number, otherwise add 0
      return sum + (job.TotalProfit && !isNaN(job.TotalProfit) ? job.TotalProfit : 0);
    }, 0);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: ongoingJobs.length,
      total: totalCount,
      data: ongoingJobs,
      sumOfTotalProfit: sumOfTotalProfit,
    });
  } catch (error) {
    console.error("Error fetching ongoing Jobs:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

//
// Function to sync total profit report
// This function is used to create a new user with the provided details
//
export const syncTotalProfitReport = async (req, res) => {
  try {
    console.log("Syncing...", new Date().toLocaleTimeString());
    const results = [];

    // Find the total profit procedure from the procedures array
    const proc = procedures.find((p) => p.name === "__Total_Profit_to_JSON");
    if (!proc) {
      throw new Error("Total Profit procedure not found");
    }

    const data = await executeStoredProc(proc.name);
    await saveToMongoDB(proc.collection, data, false);

    // Update job statuses after sync
    await updateJobStatuses();

    console.log("Synced", new Date().toLocaleTimeString());
    results.push({
      procedure: proc.name,
      status: "success",
      message: "Total Profit Report synced successfully",
    });

    res.status(200).json({
      success: true,
      message: "Total Profit Report synced successfully",
      results,
    });
  } catch (error) {
    console.error("Error syncing total profit report:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: "Failed to sync Total Profit Report",
    });
  }
};