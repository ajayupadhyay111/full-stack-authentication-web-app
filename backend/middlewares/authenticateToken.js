import jwt from "jsonwebtoken";
export const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token){
    return res.status(403).json({ message: "Unauthorized", refresh: true });
  }
  jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Token Expired", refresh: true });
      req.email = user.email;
  });
  next();
};
