import { headers } from "next/headers";
import CustomAPIError from "../src/app/api/errors";
import jwt from "jsonwebtoken";

export default function validateJWT(req) {
  // Access the list of headers
  const headersList = headers();

  // Access the Authorization header
  const authHeader = headersList.get("Authorization");

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
  // console.log("🚀 ~ file: protect.js:25 ~ validateJWT ~ decoded:", decoded);

  if (!decoded) {
    throw new CustomAPIError.UnauthenticatedError(
      "Invalid token, please login again"
    );
  }

  req.user = decoded;
}
