import onWaterModel from "../../models/clients/OnWaterModel.js";
import { runSyncOnWaterJobs } from "../admin/reports/syncOnWaterJobs.js";

export const onWaterSqlReport = async (req, res) => {
   try {
    
    await runSyncOnWaterJobs();

    const {
      departmentId,
      status,
      sortBy,
      sortOrder,
      fullPaid,
      jobType,
      userId,
    } = req.query;

    let filter = {};

    if (userId == null || userId === 0 || userId === "0") {
      return res.status(400).json({
        success: false,
        message: "User Id is required and must be valid",
      });
    }

    if (userId) {
      filter.CustomerId = userId;
    }
    
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
    const totalCount = await onWaterModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const onWater = await onWaterModel    
      .find(filter)
      .sort(sortOptions);

    // Calculate total profit by summing the TotalProfit field from all records
    const totalProfit = onWater.reduce((sum, job) => {
      // Add the TotalProfit value if it exists and is a number, otherwise add 0
      return (
        sum + (job.TotalProfit && !isNaN(job.TotalProfit) ? job.TotalProfit : 0)
      );
    }, 0);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: onWater.length,    
      total: totalCount,
      data: onWater,
      totalProfit: totalProfit,
    });
  } catch (error) {
    console.error("Error fetching on water:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};