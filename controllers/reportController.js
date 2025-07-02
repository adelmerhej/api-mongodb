import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import excelJs from "exceljs";

export const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "fullName email");

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task Id", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];
    
    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.fullName} (${user.email})`)
        .join(", ");

      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks_report.xlsx"'
    );
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while exporting Tasks.", error: err.message });
  }
};

export const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("fullName email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "fullName email _id"
    );

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        fullName: user.fullName,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "Pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "In Progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "Completed") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("User Tasks Report");

    worksheet.columns = [
        { header: "User Name", key: "fullName", width: 30},
        { header: "Email", key: "email", width: 40},
        { header: "Total Assigned tasks", key: "taskCount", width: 20},
        { header: "Pending Tasks", key: "pendingTasks", width: 20},
        {
            header: "In Progress Tasks",
            key: "inProgressTasks",
            width: 20
        },
        { header: "Completed Tasks", key: "completedTasks", width: 20}

    ]
    Object.values(userTaskMap).forEach((user) => {
        worksheet.addRow(user);
    })

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="users_tasks_report.xlsx"'
      );
      return workbook.xlsx.write(res).then(() => {
        res.end();
      });
  } catch (err) {
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};
