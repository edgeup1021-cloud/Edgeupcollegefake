import { ProtectedRoute } from "@/components/auth";
import PillNavbar from "@/components/management/PillNavbar";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <PillNavbar />
        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
