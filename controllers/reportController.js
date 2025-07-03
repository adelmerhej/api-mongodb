import totalProfitModel from "../models/admin/reports/total-profit.model.js";
import jobStatusModel from "../models/admin/reports/job-status.model.js";
import emptyContainerModel from "../models/admin/reports/empty-container.model.js";
import clientInvoiceModel from "../models/admin/reports/client-invoice.model.js";
import ongoingJobModel from "../models/admin/reports/ongoing-job.model.js";

export const totalProfitReport = async (req, res) => {
 try {
    const { status, sortBy, sortOrder } = req.query;

    let filter = {};

    if (status) {
      filter.StatusType = status;
    }

    // Create sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await totalProfitModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const totalProfits = await totalProfitModel.find(filter).sort(sortOptions);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: totalProfits.length,
      total: totalCount,
      data: totalProfits
    });
 } catch (error) {
  console.error("Error fetching total profits:", error);
  res.status(500).json({ success: false, error: "Internal Server Error" });
 }
};

export const jobStatusReport = async (req, res) => {
try {
    const { status, sortBy, sortOrder } = req.query;

    let filter = {};

    if (status) {
      filter.StatusType = status;
    }

    // Create sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await jobStatusModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const jobStatus = await jobStatusModel.find(filter).sort(sortOptions);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: jobStatus.length,
      total: totalCount,
      data: jobStatus
    });
 } catch (error) {
  console.error("Error fetching job Status:", error);
  res.status(500).json({ success: false, error: "Internal Server Error" });
 }
};

export const emptyContainerReport = async (req, res) => {
try {
    const { status, sortBy, sortOrder } = req.query;

    let filter = {};

    if (status) {
      filter.StatusType = status;
    }

    // Create sort options
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await emptyContainerModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const emptyContainers = await emptyContainerModel.find(filter).sort(sortOptions);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: emptyContainers.length,
      total: totalCount,
      data: emptyContainers
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
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await clientInvoiceModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const clientInvoices = await clientInvoiceModel.find(filter).sort(sortOptions);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: clientInvoices.length,
      total: totalCount,
      data: clientInvoices
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
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    } else {
      // Default sort by creation date, newest first
      sortOptions.createdAt = -1;
    }

    // Query total count
    const totalCount = await ongoingJobModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const ongoingJobs = await ongoingJobModel.find(filter).sort(sortOptions);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: ongoingJobs.length,
      total: totalCount,
      data: ongoingJobs
    });
 } catch (error) {
  console.error("Error fetching ongoing Jobs:", error);
  res.status(500).json({ success: false, error: "Internal Server Error" });
 }
};