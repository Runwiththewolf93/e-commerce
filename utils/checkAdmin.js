import CustomAPIError from "../src/app/api/errors";
import validateJWT from "./protect";
import User from "../models/Users";

export default async function checkAdmin(req) {
  validateJWT(req);

  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    throw new CustomAPIError.NotFoundError("User not found");
  }

  if (!user.roles || !user.roles.includes("admin")) {
    throw new CustomAPIError.UnauthorizedError("User is not an admin");
  }
}
