import joi from "joi";

import { cookies } from "next/headers";

import { apiHandler } from "_helpers/server/api";
import { usersRepo } from "_helpers/server";

module.exports = apiHandler({
  GET: getById,
  PUT: update,
  DELETE: _delete,
});

async function getById(req, { params: { id } }) {
  return await usersRepo.getById(id);
}

async function update(req, { params: { id } }) {
  const body = await req.json();
  await usersRepo.update(id, body);
}

update.schema = joi.object({
  firstName: joi.string(),
  lastName: joi.string(),
  username: joi.string(),
  password: joi.string().min(6).allow(""),
});

async function _delete(req, { params: { id } }) {
  await usersRepo.delete(id);

  // auto logout if deleted self
  if (id === req.headers.get("userId")) {
    cookies().delete("authorization");
    return { deletedSelf: true };
  }
}
