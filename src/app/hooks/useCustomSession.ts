import { useSession as useNextAuthSession } from "next-auth/react";
import { CustomSession } from "../types/authentication/authenticationTypes";

export function useCustomSession() {
  const { data: session, status } = useNextAuthSession();
  return { data: session as CustomSession | null, status };
}
