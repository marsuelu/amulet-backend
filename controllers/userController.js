const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const RegExp = require("../config/regExp");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  const users = User.find().select("-password").lean();
  if (!users) {
    return res.status(400).json({ success: false, message: "Users not found" });
  }
  res.json(users);
};

// @desc Get user by id
// @route GET /users/:id
// @access Private
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password").lean();
    if (!user) throw new Error("User not found");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc Create new users
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  try {
    const { username, user_id, password, role = "" } = req.body;
    if (!username || !user_id || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const fields = { username, user_id, password };
    for (const [key, value] of Object.entries(fields)) {
      const rule = RegExp[key];
      if (!rule.pattern.test(value)) {
        return res.status(406).json({ message: rule.message });
      }
    }

    const duplicate = await User.findOne({ user_id }).lean().exec();
    if (duplicate)
      return res.status(409).json({ message: "User ID is duplicated." });

    const hashedPwd = await bcrypt.hash(password, 10);
    await User.create({
      username,
      user_id,
      password: hashedPwd,
      ...(role && { role }),
    });
    res.status(201).json({ message: `New user ${username} created` });
  } catch (error) {
    res
      .status(400)
      .json({ message: error._message ?? "Invalid user data received." });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { username, user_id, password = "", role = "" } = req.body;
  if (!username || !user_id || !(password || role)) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const newObj = { ...(role && { role }), ...(username && { username }) };
    if (password) {
      newObj.password = await bcrypt.hash(password, 10);
    }
    const user = await User.findOneAndUpdate({ user_id }, newObj);
    if (!user) throw new Error("Could not find a matched user.");
    return res.status(201).json({ message: `User ${username} has updated.` });
  } catch (error) {
    return res.status(400).json({
      message: error._message ?? error.message ?? "Invalid user data received.",
    });
  }
};

// @desc Delete
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ message: "Give me the correct user." });
  }
  try {
    const user = await User.findOneAndDelete({ user_id });
    if (!user) throw new Error("Could not find a matched user.");
    return res
      .status(200)
      .json({ message: `User ${user.username} has been deleted.` });
  } catch (error) {
    return res.status(400).json({
      message: error._message ?? error.message ?? "Invalid user data received.",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
};
