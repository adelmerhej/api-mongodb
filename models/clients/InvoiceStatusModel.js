import mongoose from "mongoose";

// Sub-schema for the nested Invoices
const InvoiceSchema = new mongoose.Schema({
  JobNo: {
    type: Number,
    required: true,
  },
  DepartmentId: {
    type: Number,
    required: true,
  },
  InvoiceNo: {
    type: Number,
    required: true,
  },
  InvoiceDate: {
    type: Date,
    required: true,
  },
  DueDate: {
    type: Date,
    required: true,
  },
  CurrencyCode: {
    type: String,
    required: true,
  },
  TotalAmount: {
    type: Number,
    required: true,
  },
  TotalReceived: {
    type: Number,
    required: true,
  },
  TotalDue: {
    type: Number,
    required: true,
  },
  CustomerId: {
    type: Number,
    required: true,
  },
  ConsigneeId: {
    type: Number,
    required: true,
  },
});

const ClientInvoiceSchema = new mongoose.Schema(
  {
    JobNo: {
      type: Number,
      required: true,
    },
    JobType: {
      type: String,
      required: true,
    },
    DepartmentId: {
      type: Number,
      required: true,
    },
    DepartmentName: {
      type: String,
      required: true,
    },
    ReferenceNo: {
      type: String,
    },
    JobDate: {
      type: Date,
    },
    Customer: {
      type: String,
    },
    Consignee: {
      type: String,
    },
    Mbl: {
      type: String,
    },
    CountryOfDeparture: {
      type: String,
    },
    CountryOfDestination: {
      type: String,
    },
    Pol: {
      type: String,
    },
    Pod: {
      type: String,
    },
    Etd: {
      type: Date,
    },
    Eta: {
      type: Date,
    },
    Atd: {
      type: Date,
    },
    Ata: {
      type: Date,
    },
    Volume: {
      type: String, // Or Number, depending on how 'Quantities' is stored
    },
    Status: {
      type: String,
    },
    StatusType: {
      type: String,
    },
    JobStatusType: {
      type: String,
    },
    UserName: {
      type: String,
    },
    Salesman: {
      type: String,
    },
    ArrivalDate: {
      type: Date,
    },
    Notes: {
      type: String,
    },
    Vessel: {
      type: String,
    },
    TotalInvoices: {
      type: Number,
    },
    TotalCosts: {
      type: Number,
    },
    TotalProfit: {
      type: Number,
    },
    CustomerId: {
      type: Number,
      required: true,
    },
    ConsigneeId: {
      type: Number,
      required: true,
    },
    Invoices: [InvoiceSchema], // Array of nested InvoiceSchema
  },
  { timestamps: true, collection: "clientinvoices" }
);

const ClientInvoiceReportModel = mongoose.model(
  "ClientInvoiceReport",
  ClientInvoiceSchema
);

export { ClientInvoiceReportModel };
