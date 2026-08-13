import { requireAdmin } from "@/app/auth/server";
import { AdminShell } from "@/components/admin-shell";
import type { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return <AdminShell>{children}</AdminShell>;
}
