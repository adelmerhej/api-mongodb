import { executeStoredProc, saveToMongoDB, updateJobStatuses } from "../../../utils/dbUtils.js";

const procedures = [
  { name: '__ClientsInvoiceReport_to_JSON', collection: 'clientinvoices' },
];

export const syncClientInvocies = async (req, res) => {
    try {
      console.log("Syncing...", new Date().toLocaleTimeString());
      const results = [];
  
      // Find the total profit procedure from the procedures array
      const proc = procedures.find((p) => p.name === "__ClientsInvoiceReport_to_JSON");
      if (!proc) {
        throw new Error("Clients Invoice procedure not found");
      }
  
      const data = await executeStoredProc(proc.name);
      await saveToMongoDB(proc.collection, data, false);
  
      // Update job statuses after sync
      await updateJobStatuses();
  
      console.log("Synced", new Date().toLocaleTimeString());
      results.push({
        procedure: proc.name,
        status: "success",
        message: "Clients Invoice Report synced successfully",
      });
  
      res.status(200).json({
        success: true,
        message: "Clients Invoice Report synced successfully",
        results,
      });
    } catch (error) {
      console.error("Error syncing clients invoice report:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to sync Clients Invoice Report",
      });
    }
  };
