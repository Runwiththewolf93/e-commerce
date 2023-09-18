import { cookies } from "next/headers";

export default function checkAuthCookie() {
  const cookieStore = cookies();
  const userAuthCookie = cookieStore.get("user-auth");

  if (!userAuthCookie) {
    throw new Error("You are not logged in");
  }
}
