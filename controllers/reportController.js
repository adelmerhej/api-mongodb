import totalProfitModel from "../models/admin/reports/total-profit.model.js";
import jobStatusModel from "../models/admin/reports/job-status.model.js";
import emptyContainerModel from "../models/admin/reports/empty-container.model.js";
import clientInvoiceModel from "../models/admin/reports/client-invoice.model.js";
import ongoingJobModel from "../models/admin/reports/ongoing-job.model.js";

export const totalProfitReport = async (req, res) => {
 try {
    const { status, sortBy, sortOrder, page = 1, limit = 0 } = req.query;

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

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query total count for pagination info
    const totalCount = await totalProfitModel.countDocuments(filter);

    // Query with filter, sort, and pagination
    const totalProfits = await totalProfitModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Return response with pagination info
    res.status(200).json({
      success: true,
      count: totalProfits.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: totalProfits
    });
 } catch (error) {
  console.error("Error fetching total profits:", error);
  res.status(500).json({ success: false, error: "Internal Server Error" });
 }
};

export const jobStatusReport = async (req, res) => {
try {
    const { status, sortBy, sortOrder, page = 1, limit = 0 } = req.query;

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

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query total count for pagination info
    const totalCount = await jobStatusModel.countDocuments(filter);

    // Query with filter, sort, and pagination
    const totalProfits = await jobStatusModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Return response with pagination info
    res.status(200).json({
      success: true,
      count: totalProfits.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: totalProfits
    });
 } catch (error) {
  console.error("Error fetching total profits:", error);
  res.status(500).json({ success: false, error: "Internal Server Error" });
 }
};

export const emptyContainerReport = async (req, res) => {
try {
    const { status, sortBy, sortOrder, page = 1, limit = 0 } = req.query;

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

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query total count for pagination info
    const totalCount = await emptyContainerModel.countDocuments(filter);

    // Query with filter, sort, and pagination
    const totalProfits = await emptyContainerModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Return response with pagination info
    res.status(200).json({
      success: true,
      count: totalProfits.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: totalProfits
    });
 } catch (error) {
  console.error("Error fetching Empty Containers:", error);
  res.status(500).json({ success: false, error: "Internal Server Error" });
 }
};

export const clientInvoiceReport = async (req, res) => {
try {
    const { status, sortBy, sortOrder, page = 1, limit = 0 } = req.query;

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

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query total count for pagination info
    const totalCount = await clientInvoiceModel.countDocuments(filter);

    // Query with filter, sort, and pagination
    const totalProfits = await clientInvoiceModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Return response with pagination info
    res.status(200).json({
      success: true,
      count: totalProfits.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: totalProfits
    });
 } catch (error) {
  console.error("Error fetching Client Invoice:", error);
  res.status(500).json({ success: false, error: "Internal Server Error" });
 }
};

export const ongoingJobsReport = async (req, res) => {
try {
    const { status, sortBy, sortOrder, page = 1, limit = 0 } = req.query;

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

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query total count for pagination info
    const totalCount = await ongoingJobModel.countDocuments(filter);

    // Query with filter, sort, and pagination
    const totalProfits = await ongoingJobModel.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Return response with pagination info
    res.status(200).json({
      success: true,
      count: totalProfits.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      data: totalProfits
    });
 } catch (error) {
  console.error("Error fetching Ongoing Jobs:", error);
  res.status(500).json({ success: false, error: "Internal Server Error" });
 }
};