const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  console.log("verifyJWT token", token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log("verifyJWT error", err);
    console.log("verifyJWT decoded", decoded);
    if (err) {
      if (err.name === "TokenExpiredError")
        return res.status(401).json({ message: "Token expired" });
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user_id = decoded.user_id;
    req.role = decoded.role;
    next();
  });
};

module.exports = verifyJWT;
