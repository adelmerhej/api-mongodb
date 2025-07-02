import Client from "../models/client.model.js";

export const getClients = async (req, res) => {
  try {
    const users = await Client.find({ role: "user" }).select("-password");

    //Add taskcount to each user
    const usersWithTaskcounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );
    res.json(usersWithTaskcounts);
  } catch (err) {
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(401).json({ message: "User not found." });
    }
    user.deleteOne()
  } catch (err) {
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};
