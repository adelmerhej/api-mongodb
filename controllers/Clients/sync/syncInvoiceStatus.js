// controllers/Clients/sync/syncInvoiceStatus.js

import { executeStoredProc as defaultExecuteStoredProc, saveToMongoDB as defaultSaveToMongoDB } from "../../../utils/dbUtils.js";

const procedures = [
  { name: '__cli_InvoiceStatusReport_to_JSON', collection: 'invoiceStatus' },
];

export const createSyncInvoiceStatus = ({ executeStoredProc = defaultExecuteStoredProc, saveToMongoDB = defaultSaveToMongoDB } = {}) => {
  return async (req, res) => {
    try {
      console.log("Syncing...", new Date().toLocaleTimeString());
      const results = [];
      
      const proc = procedures.find((p) => p.name === "__cli_InvoiceStatusReport_to_JSON");
      if (!proc) {
        throw new Error("Invoice Status procedure not found");
      }

      const data = await executeStoredProc(proc.name);
      await saveToMongoDB(proc.collection, data, false);

      console.log("Synced", new Date().toLocaleTimeString());
      results.push({
        procedure: proc.name,
        status: "success",
        message: "Invoice Status synced successfully",
      });

      res.status(200).json({
        success: true,
        message: "Invoice Status synced successfully",
        results,
      });
    } catch (error) {
      console.error("Error syncing Invoice Status:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Failed to sync Invoice Status",
      });
    }
  };
};

export const syncInvoiceStatus = createSyncInvoiceStatus();

export async function runSyncInvoiceStatus({ executeStoredProc = defaultExecuteStoredProc, saveToMongoDB = defaultSaveToMongoDB } = {}) {
  const proc = procedures.find((p) => p.name === "__cli_InvoiceStatusReport_to_JSON");
  if (!proc) {
    throw new Error("Invoice Status procedure not found");
  }
  const data = await executeStoredProc(proc.name);
  await saveToMongoDB(proc.collection, data, false);
  return { procedure: proc.name, status: "success" };
}

