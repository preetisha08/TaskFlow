const Task = require("../models/Task");
const Team = require("../models/Team");

const validateAssignee = async (currentUserId, assignedTo) => {
  if (!assignedTo) return true;

  const team = await Team.findOne({
    "members.user": currentUserId,
  });

  if (!team) return false;

  return team.members.some(
    (member) => member.user.toString() === assignedTo.toString(),
  );
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } =
      req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Title and due date are required",
      });
    }

    const validAssignee = await validateAssignee(req.user._id, assignedTo);

    if (!validAssignee) {
      return res.status(400).json({
        message: "Task can only be assigned to a member of your team",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id,
      assignedTo: assignedTo || null,
    });

    const populatedTask = await Task.findById(task._id).populate(
      "assignedTo",
      "name email",
    );

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating task",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ user: req.user._id }, { assignedTo: req.user._id }],
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching tasks",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { assignedTo: req.user._id }],
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isTaskOwner = task.user.toString() === req.user._id.toString();

    if (!isTaskOwner) {
      const allowedFields = ["status"];
      const requestedFields = Object.keys(req.body);

      const onlyStatusUpdate = requestedFields.every((field) =>
        allowedFields.includes(field),
      );

      if (!onlyStatusUpdate) {
        return res.status(403).json({
          message: "Assigned members can only update task status",
        });
      }
    }

    if (isTaskOwner && "assignedTo" in req.body) {
      const validAssignee = await validateAssignee(
        req.user._id,
        req.body.assignedTo,
      );

      if (!validAssignee) {
        return res.status(400).json({
          message: "Task can only be assigned to a member of your team",
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("assignedTo", "name email");

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating task",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or you cannot delete it",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting task",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
