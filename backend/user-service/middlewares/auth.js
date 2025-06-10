const { jwt } = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const token = tokenFromHeader || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "mysecret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};
// exports.authenticateUser = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: "Authentication token not provided" });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ error: "Invalid authentication token" });
//     }

//     // Add the decoded user information to the request object
//     req.user = decoded;
//     next();
//   });
// };
