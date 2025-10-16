import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.jwt;
  console.log("Cookies:", req.cookies); // debug
  if (!token) return res.status(401).json({ message: "Unauthorized access" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    console.log("Decoded:", decoded); // debug
    req.user = decoded;
    next();
  });
};
