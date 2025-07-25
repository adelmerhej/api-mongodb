import { executeStoredProc, saveToMongoDB, updateJobStatuses } from "../../../utils/dbUtils.js";

const procedures = [
  { name: '__OngoingJobs_Status_to_JSON', collection: 'ongoingjobs' },
];

export const syncOngoingJobs = async (req, res) => {
    try {
      console.log("Syncing...", new Date().toLocaleTimeString());
      const results = [];
  
      // Find the total profit procedure from the procedures array
      const proc = procedures.find((p) => p.name === "__OngoingJobs_Status_to_JSON");
      if (!proc) {
        throw new Error("Ongoing Jobs Status procedure not found");
      }
  
      const data = await executeStoredProc(proc.name);
      await saveToMongoDB(proc.collection, data, false);
  
      // Update job statuses after sync
      await updateJobStatuses();
  
      console.log("Synced", new Date().toLocaleTimeString());
      results.push({
        procedure: proc.name,
        status: "success",
        message: "Ongoing Jobs Status synced successfully",
      });
  
      res.status(200).json({
        success: true,
        message: "Ongoing Jobs Status synced successfully",
        results,
      });
    } catch (error) {
      console.error("Error syncing Ongoing Jobs:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to sync Ongoing Jobs Status",
      });
    }
  };

