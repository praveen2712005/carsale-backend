// ========================= AUTH MIDDLEWARE =========================
// middleware/auth.js

const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {

      return res.status(401).json({
        message: "No token provided"
      });

    }

    // REMOVE "Bearer "
    const token = authHeader.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        message: "Invalid token format"
      });

    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED USER:", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.log("AUTH ERROR:", error);

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = auth;