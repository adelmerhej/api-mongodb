import { executeStoredProc, saveToMongoDB, updateJobStatuses } from "../../../utils/dbUtils.js";

const procedures = [
  { name: '__cli_OnWaterReport_to_JSON', collection: 'ClientOnWater' },
];

export const syncOnWaterJobs = async (req, res) => {
    try {
      const results = [];
  
      // Find the OnWater procedure from the procedures array
      const proc = procedures.find((p) => p.name === "__cli_OnWaterReport_to_JSON");
      if (!proc) {
        throw new Error("On Water procedure not found");
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
        message: "On Water data synced successfully",
        recordCount: data ? data.length : 0,
      });
  
      res.status(200).json({
        success: true,
        message: "On Water data synced successfully",
        recordCount: data ? data.length : 0,
        results,
      });
    } catch (error) {
      console.error("❌ Error syncing On Water data:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to sync On Water data",
      });
    }
  };

