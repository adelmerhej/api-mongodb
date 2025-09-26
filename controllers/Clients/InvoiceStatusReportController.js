import { ClientInvoiceReportModel } from "../../models/clients/InvoiceStatusModel.js";

export const invoiceStatusReport = async (req, res) => {
  try {
    const {
      sortBy,
      sortOrder,
      page,
      limit,
      statusType,
      departmentId,
      jobType,
      jobStatusType,
      userId,
    } = req.query;

    let filter = {};

    if (userId == null || userId === 0 || userId === "0") {
      return res.status(400).json({
        success: false,
        message: "User ID is required and must be valid",
      });
    }

    if (userId) {
      filter.CustomerId = userId;
    }

    // Apply filters based on query parameters
    // if (fullPaid === "true") {
    //   filter.FullPaid = true;
    // } else if (fullPaid === "false") {
    //   filter.FullPaid = false;
    // }

    if (statusType === "Invoices") {
      filter = {
        ...filter,
        $or: [
          { "Invoices.InvoiceNo": { $ne: 0 } },
          { "Invoices.InvoiceNo": { $exists: false } }
        ]
      };
    } else if (statusType === "Drafts") {
      filter = {
        ...filter,
        $or: [
          { "Invoices.InvoiceNo": 0 },
          { "Invoices.InvoiceNo": { $exists: false } }
        ]
      };
    }

    if (departmentId) {
      filter.DepartmentId = departmentId;
    }
    
    if (jobType) {
      filter.JobType = jobType;
    }

    if(jobStatusType){
      filter.JobStatusType = jobStatusType;
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
    const totalCount = await ClientInvoiceReportModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const clientInvoices = await ClientInvoiceReportModel
      .find(filter)
      .sort(sortOptions);

    // Calculate total profit by summing the TotalProfit field from all records
    const sumOfTotalProfit = clientInvoices.reduce((sum, job) => {
      return sum + (job.TotalProfit && !isNaN(job.TotalProfit) ? job.TotalProfit : 0);
    }, 0);

    const sumOfTotalInvoices = clientInvoices.reduce((sum, job) => {
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
    console.error("Error fetching Client Invoice Records:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const invoiceDetailClientReport = async (req, res) => {
  try {
    const {
      sortBy,
      sortOrder,
      page,
      limit,
      statusType,
      departmentId,
      jobType,
    } = req.query;
    
    let filter = {};

    if (statusType === "Invoices") {
      filter = {
        ...filter,
        $or: [
          { "Invoices.InvoiceNo": { $ne: 0 } },
          { "Invoices.InvoiceNo": { $exists: false } }
        ]
      };
    } else if (statusType === "Drafts") {
      filter = {
        ...filter,
        $or: [
          { "Invoices.InvoiceNo": 0 },
          { "Invoices.InvoiceNo": { $exists: false } }
        ]
      };
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
    const totalCount = await ClientInvoiceReportModel.countDocuments(filter);

    // Query with filter and sort, but no pagination to return all records
    const clientInvoices = await ClientInvoiceReportModel
      .find(filter)
      .sort(sortOptions);

    // Transform the data to flatten the invoices array
    const flattenedInvoices = [];
    let sumOfTotalProfit = 0;
    let sumOfTotalInvoices = 0;

    clientInvoices.forEach(job => {
      // Add job's profit to total profit if it exists
      if (job.TotalProfit && !isNaN(job.TotalProfit)) {
        sumOfTotalProfit += job.TotalProfit;
      }

      // Process each invoice in the job
      if (job.Invoices && job.Invoices.length > 0) {
        job.Invoices.forEach(invoice => {
          // Create a new invoice object with job details
          const flatInvoice = {
            JobNo: job.JobNo,
            JobType: job.JobType,
            DepartmentId: job.DepartmentId,
            DepartmentName: job.DepartmentName,
            Customer: job.Customer,
            // Include all invoice fields
            ...(invoice.toObject ? invoice.toObject() : invoice)
          };
          
          // Remove any nested objects that might have been included
          delete flatInvoice._id;
          
          flattenedInvoices.push(flatInvoice);

          // Add to invoice total if amount exists
          if (invoice.TotalAmount && !isNaN(invoice.TotalAmount)) {
            sumOfTotalInvoices += invoice.TotalAmount;
          }
        });
      }
    });

    // Return response with flattened data
    res.status(200).json({
      success: true,
      count: flattenedInvoices.length,
      total: totalCount,
      data: flattenedInvoices,
      sumOfTotalProfit: sumOfTotalProfit,
      sumOfTotalInvoices: sumOfTotalInvoices,
    });
  } catch (error) {
    console.error("Error fetching Client Invoice Records:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};