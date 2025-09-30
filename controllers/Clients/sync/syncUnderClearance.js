// controllers/Clients/sync/syncUnderClearance.js

import { executeStoredProc as defaultExecuteStoredProc, saveToMongoDB as defaultSaveToMongoDB } from "../../../utils/dbUtils.js";

const procedures = [
  { name: '__cli_UnderClearanceReport_to_JSON', collection: 'underClearance' },
];

export const createSyncTobeLoadedJobs = ({ executeStoredProc = defaultExecuteStoredProc, saveToMongoDB = defaultSaveToMongoDB } = {}) => {
  return async (req, res) => {
    try {
      console.log("Syncing...", new Date().toLocaleTimeString());
      const results = [];
      
      const proc = procedures.find((p) => p.name === "__cli_UnderClearanceReport_to_JSON");
      if (!proc) {
        throw new Error("Under Clearance Jobs procedure not found");
      }

      const data = await executeStoredProc(proc.name);
      await saveToMongoDB(proc.collection, data, false);

      console.log("Synced", new Date().toLocaleTimeString());
      results.push({
        procedure: proc.name,
        status: "success",
        message: "Under Clearance Jobs synced successfully",
      });

      res.status(200).json({
        success: true,
        message: "Under Clearance Jobs synced successfully",
        results,
      });
    } catch (error) {
      console.error("Error syncing Under Clearance Jobs:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to sync Under Clearance Jobs",
      });
    }
  };
};

export const syncUnderClearanceJobs = createSyncUnderClearanceJobs();

export async function runSyncUnderClearanceJobs({ executeStoredProc = defaultExecuteStoredProc, saveToMongoDB = defaultSaveToMongoDB } = {}) {
  const proc = procedures.find((p) => p.name === "__cli_UnderClearanceReport_to_JSON");
  if (!proc) {
    throw new Error("Under Clearance Jobs procedure not found");
  }
  const data = await executeStoredProc(proc.name);
  await saveToMongoDB(proc.collection, data, false);
  return { procedure: proc.name, status: "success" };
}

