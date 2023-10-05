import { headers } from "next/headers";
import CustomAPIError from "../src/app/api/errors";
import jwt from "jsonwebtoken";

export default function validateJWT(req) {
  const headersList = headers();
  console.log(
    "🚀 ~ file: protect.js:7 ~ validateJWT ~ headersList:",
    headersList
  );

  // Access the Authorization header
  const authHeader = headersList.get("Authorization");
  console.log(
    "🚀 ~ file: protect.js:7 ~ validateJWT ~ authHeader:",
    authHeader
  );

  if (!authHeader) {
    throw new CustomAPIError.UnauthenticatedError(
      "Authorization header is missing"
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    decoded = null;
  }

  if (!decoded) {
    throw new CustomAPIError.UnauthenticatedError("Invalid token");
  }

  req.user = decoded;
}
