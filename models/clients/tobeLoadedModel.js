import mongoose from "mongoose";

const TobeLoadedSchema = new mongoose.Schema(
  {
    Id: Number,
    JobNo: Number,
    JobDate: Date,
    ReferenceNo: String,
    Mbl: String,
    CustomerId: Number,
    CustomerName: String,
    ConsigneeId: Number,
    ConsigneeName: String,
    Departure: String,
    Destination: String,
    Vessel: String,
    ArrivalDate: Date,
    ETD: Date,
    ETA: Date,
    ATD: Date,
    ATA: Date,
    Salesman: String,
    username: String,
    Agent: String,
    Status: String,
    Description: String,
    MissingDocs: String,
    SeaCarrier: String,
    Quantities: String,
    LoadedStatus: String,
    LoadedDestination: String,
    LoadingDate: Date,
    CutOffDate: Date,
    Tejrim: Boolean,
    CanceledJob: Boolean,
    UserId: Number,
    SalesId: Number,
    OperatingUserId: Number,
    DepartmentId: Number,
    DepartmentName: String,
    SeaFreight: Number,
    TotalProfit: Number,
    AlreadyLate: Boolean
  },
  { timestamps: true, collection: "tobeLoaded" }
);

export default mongoose.model("TobeLoaded", TobeLoadedSchema);
