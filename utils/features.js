import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "none",
    })
    .json({
      success: true,
      message,
    });
};

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const getUserIdFromCookie = (req) => {
  const token = req.cookies.token;

  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userId = decodedToken._id;

    return userId;
  } catch (error) {
    return null;
  }
};
