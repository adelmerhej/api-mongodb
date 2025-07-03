import mongoose from "mongoose";

const TotalProfitSchema = new mongoose.Schema(
  {
    JobNo: String,
    JobDate: Date,
    CustomerName: String,
    ConsigneeName: String,
    DepartmentName: String,
    StatusType: String,
    TotalProfit: Number,
    Eta: Date,
    Ata: Date,
    UserName: String,
    Notes: String,
    CountryOfDeparture: String,
    Departure: String,
    Destination: String,
    ReferenceNo: String,
    vessel: String,
    TotalInvoices: Number,
    TotalCosts: Number,
}, { timestamps: true }
);

export default mongoose.model("TotalProfit", TotalProfitSchema);
    