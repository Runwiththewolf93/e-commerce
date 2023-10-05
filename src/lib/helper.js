import jwt from "jsonwebtoken";

export const generateToken = email => {
  return jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const validateToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
