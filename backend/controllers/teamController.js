const Team = require("../models/Team");
const User = require("../models/User");

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Team name is required",
      });
    }

    const existingTeam = await Team.findOne({
      "members.user": req.user._id,
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "You already belong to a team",
      });
    }

    const team = await Team.create({
      name: name.trim(),
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "Owner",
        },
      ],
    });

    const populatedTeam = await Team.findById(team._id).populate(
      "members.user",
      "name email",
    );

    res.status(201).json({
      message: "Team created successfully",
      team: populatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating team",
    });
  }
};

const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findOne({
      "members.user": req.user._id,
    }).populate("members.user", "name email");

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching team",
    });
  }
};

const addMember = async (req, res) => {
  try {
    const { email } = req.body;

    const team = await Team.findOne({
      owner: req.user._id,
    });

    if (!team) {
      return res.status(403).json({
        message: "Only the team owner can add members",
      });
    }

    const userToAdd = await User.findOne({
      email: email?.toLowerCase().trim(),
    });

    if (!userToAdd) {
      return res.status(404).json({
        message: "No registered user found with this email",
      });
    }

    const alreadyInTeam = await Team.findOne({
      "members.user": userToAdd._id,
    });

    if (alreadyInTeam) {
      return res.status(400).json({
        message: "This user already belongs to a team",
      });
    }

    team.members.push({
      user: userToAdd._id,
      role: "Member",
    });

    await team.save();

    const populatedTeam = await Team.findById(team._id).populate(
      "members.user",
      "name email",
    );

    res.status(200).json({
      message: "Member added successfully",
      team: populatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while adding member",
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const team = await Team.findOne({
      owner: req.user._id,
    });

    if (!team) {
      return res.status(403).json({
        message: "Only the team owner can remove members",
      });
    }

    if (req.params.userId === req.user._id.toString()) {
      return res.status(400).json({
        message: "The team owner cannot be removed",
      });
    }

    team.members = team.members.filter(
      (member) => member.user.toString() !== req.params.userId,
    );

    await team.save();

    const populatedTeam = await Team.findById(team._id).populate(
      "members.user",
      "name email",
    );

    res.status(200).json({
      message: "Member removed successfully",
      team: populatedTeam,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while removing member",
    });
  }
};

module.exports = {
  createTeam,
  getMyTeam,
  addMember,
  removeMember,
};
