import { Session } from "next-auth";

export function isAdmin(session: Session | null) {
  return session?.user?.role === "admin";
}
