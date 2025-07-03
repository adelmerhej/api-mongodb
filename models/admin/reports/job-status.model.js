import mongoose from "mongoose";

const JobStatusSchema = new mongoose.Schema(
  {
    DepartmentName: String,
    StatusType: String,
    TotalProfit: Number,
    OrderBy: String,
    JobNo: String,
    ReferenceNo: String,
    JobDate: Date,
    OperatingUserId: String,
    DepartmentId: Number,
    UserName: String,
    CustomerName: String,
    PendingInvoices: Number,
    PendingCosts: Number,
    Tejrim: String,
    CanceledJob: Boolean,
    ConsigneeName: String,
    PaymentDate: Date,
    MemberOf: String,
    JobType: String,
    Atd: Date,
    Etd: Date,
    Ata: Date,
    Eta: Date,
    FullPaid: Boolean,
    PaidDO: Boolean,
    PaidDate: Date,
    MissingDocuments: Boolean,
    MissingDocumentsDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("JobStatus", JobStatusSchema);
