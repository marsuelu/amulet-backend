const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateAccessToken = (user_id, role) => {
  return jwt.sign({ user_id, role }, process.env.ACCESS_TOKEN_SECRET, {
    // expiresIn: "15m",
    expiresIn: "1m",
  });
};

const generateRefreshToken = (user_id, role) => {
  return jwt.sign({ user_id, role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const login = async (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  const foundUser = await User.findOne({ user_id })
    .select("user_id role active +password")
    .exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const ifMatch = await bcrypt.compare(password, foundUser.password);
  if (!ifMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const accessToken = generateAccessToken(foundUser.user_id, foundUser.role);
  const refreshToken = generateRefreshToken(foundUser.user_id, foundUser.role);
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true, // only send cookies over HTTPS
    sameSite: "None", // allow cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.status(200).json({ accessToken, message: "Login successful" });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      console.log("refresh token error", err);
      console.log("refresh token decoded", decoded);
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findOne({
        user_id: decoded.user_id,
      }).lean();
      if (!foundUser || !foundUser.active) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const accessToken = generateAccessToken(decoded.user_id, decoded.role);
      return res.status(200).json({ message: "Token refreshed", accessToken });
    },
  );
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  logout,
};
