import { executeStoredProc, saveToMongoDB, updateJobStatuses } from "../../../utils/dbUtils.js";

const procedures = [
  { name: '__Total_Profit_to_JSON', collection: 'totalprofits' },
];

export const syncTotalProfit = async (req, res) => {
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
        message: "Total Profit synced successfully",
      });
  
      res.status(200).json({
        success: true,
        message: "Total Profit synced successfully",
        results,
      });
    } catch (error) {
      console.error("Error syncing Total Profit:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to sync Total Profit",
      });
    }
  };

