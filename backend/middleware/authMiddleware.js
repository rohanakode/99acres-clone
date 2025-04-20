const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  console.log(" authMiddleware triggered");

  const authHeader = req.headers.authorization;
  console.log(" Authorization header:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1];
  console.log(" JWT Secret being used:", SECRET);
  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Received token:", token);
    console.log("Decoded token:", decoded);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
