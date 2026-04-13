import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;   // ✅ from cookie

    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized: Login Again"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.json({
        success: false,
        message: "Invalid Token"
      });
    }

    req.userId = decoded.userId;   // ✅ IMPORTANT FIX

    next();
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export default userAuth;