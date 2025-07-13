import mongoose from "mongoose";

const ClientInvoiceSchema = new mongoose.Schema(
  {
    JobNo: Number,
    ReferenceNo: String,
    InvoiceNo: Number,
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
    TotalProfit: Number,
    DepartmentId: String,
    MemberOf: String,
    JobType: String,
  },
  { timestamps: true, collection: "clientinvoices" }
);

const ClientInvoiceDetailSchema = new mongoose.Schema(
  {
    JobNo: Number,
    DepartmentId: Number,
    DepartmentName: String,
    ReferenceNo: String,
    InvoiceNo: Number,
    InvoiceDate: Date,
    CustomerName: String,
    DueDate: Date,
    TotalInvoice: Number,
    TotalDueAmount: Number,
    TotalPaidAmount: Number,
    InvoiceStatus: String,
    PaymentStatus: String,
  },
  { timestamps: true, collection: "clientinvoices" }
);

const ClientInvoice = mongoose.model("ClientInvoice", ClientInvoiceSchema);
const ClientInvoiceDetail = mongoose.model("ClientInvoiceDetail", ClientInvoiceDetailSchema);

export { ClientInvoice, ClientInvoiceDetail };
