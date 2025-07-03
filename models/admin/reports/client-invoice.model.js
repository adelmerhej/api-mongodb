import mongoose from "mongoose";

const ClientInvoiceSchema = new mongoose.Schema(
  {
    JobNo: String,
    ReferenceNo: String,
    InvoiceNo: String,
    Mbl: String,
    Pol: String,
    Pod: String,
    JobDate: Date,
    CustomerName: String,
    ConsigneeName: String,
    DepartmentName: String,
    Salesman: String,
    StatusType: String,
    TotalInvoiceAmount: Number,
    ETA: Date,
    ATA: Date,
    UserName: String,
    Notes: String,
    CountryOfDeparture: String,
    Departure: String,
    Destination: String,
    vessel: String,
    TotalInvoices: Number,
    TotalCosts: Number,
    DepartmentId: String,
    MemberOf: String,
    JobType: String,
  },
  { timestamps: true, collection: "ClientsInvoiceReport" }
);

export default mongoose.model("ClientInvoice", ClientInvoiceSchema);
