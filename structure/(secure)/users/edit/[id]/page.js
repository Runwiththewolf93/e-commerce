"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AddEdit } from "_components/users";
import { Spinner } from "_components";
import { useUserService } from "_services";

export default Edit;

function Edit({ params: { id } }) {
  const router = useRouter();
  const userService = useUserService();
  const user = userService.user;

  useEffect(() => {
    if (!id) return;

    // fetch user for add/edit form
    userService.getById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return user ? <AddEdit title="Edit User" user={user} /> : <Spinner />;
}
