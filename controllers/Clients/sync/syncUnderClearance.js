import { executeStoredProc, saveToMongoDB, updateJobStatuses } from "../../../utils/dbUtils.js";

const procedures = [
  { name: '__cli_UnderClearanceReport_to_JSON', collection: 'underclearance' },
];

export const syncUnderClearanceJobs = async (req, res) => {
    try {
      const results = [];
  
      // Find the Under Clearance Jobs procedure from the procedures array  
      const proc = procedures.find((p) => p.name === "__cli_UnderClearanceReport_to_JSON");
      if (!proc) {
        throw new Error("Under Clearance Jobs procedure not found");
      }

       
      // Execute stored procedure with detailed logging
      const data = await executeStoredProc(proc.name);
  
      // Save to MongoDB with detailed logging
      await saveToMongoDB(proc.collection, data, false);
      
      // Update job statuses after sync
      await updateJobStatuses();  
      results.push({
        procedure: proc.name,
        status: "success",
        message: "Under Clearance Jobs data synced successfully",
        recordCount: data ? data.length : 0,
      });
  
      res.status(200).json({
        success: true,
        message: "Under Clearance Jobs data synced successfully",
        recordCount: data ? data.length : 0,
        results,
      });
    } catch (error) {
      console.error("❌ Error syncing Under Clearance Jobs data:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to sync Under Clearance Jobs data",
      });
    }
  };

