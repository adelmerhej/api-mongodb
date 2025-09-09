import tobeLoadedModel from "../../models/clients/tobeLoadedModel.js";

export const tobeLoadedReport = async (req, res) => {
  try {
    const {
      departmentId,
      status,
      sortBy,
      sortOrder,
      fullPaid,
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
    const totalCount = await tobeLoadedModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const tobeLoaded = await tobeLoadedModel    
      .find(filter)
      .sort(sortOptions);

    // Calculate total profit by summing the TotalProfit field from all records
    const totalProfit = tobeLoaded.reduce((sum, job) => {
      // Add the TotalProfit value if it exists and is a number, otherwise add 0
      return (
        sum + (job.TotalProfit && !isNaN(job.TotalProfit) ? job.TotalProfit : 0)
      );
    }, 0);

    // Return response with all records
    res.status(200).json({
      success: true,
      count: tobeLoaded.length,
      total: totalCount,
      data: tobeLoaded,
      totalProfit: totalProfit,
    });
  } catch (error) {
    console.error("Error fetching to be loaded:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};