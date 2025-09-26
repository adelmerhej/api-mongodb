import { executeStoredProc as defaultExecuteStoredProc, saveToMongoDB as defaultSaveToMongoDB } from "../../../utils/dbUtils.js";

const procedures = [
  { name: '__cli_OnWaterReport_to_JSON', collection: 'onWaterjobs' },
];

export const createSyncOnWaterJobs = ({ executeStoredProc = defaultExecuteStoredProc, saveToMongoDB = defaultSaveToMongoDB } = {}) => {
  return async (req, res) => {
    try {
      console.log("Syncing...", new Date().toLocaleTimeString());
      const results = [];

      const proc = procedures.find((p) => p.name === "__cli_OnWaterReport_to_JSON");
      if (!proc) {
        throw new Error("On Water Jobs Status procedure not found");
      }

      const data = await executeStoredProc(proc.name);
      await saveToMongoDB(proc.collection, data, false);

      console.log("Synced", new Date().toLocaleTimeString());
      results.push({
        procedure: proc.name,
        status: "success",
        message: "On Water Jobs Status synced successfully",
      });

      res.status(200).json({
        success: true,
        message: "On Water Jobs Status synced successfully",
        results,
      });
    } catch (error) {
      console.error("Error syncing On Water Jobs:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to sync On Water Jobs Status",
      });
    }
  };
};

export const syncOnWaterJobs = createSyncOnWaterJobs();

export async function runSyncOnWaterJobs({ executeStoredProc = defaultExecuteStoredProc, saveToMongoDB = defaultSaveToMongoDB } = {}) {
  const proc = procedures.find((p) => p.name === "__cli_OnWaterReport_to_JSON");
  if (!proc) {
    throw new Error("On Water Jobs Status procedure not found");
  }
  const data = await executeStoredProc(proc.name);
  await saveToMongoDB(proc.collection, data, false);
  return { procedure: proc.name, status: "success" };
}

