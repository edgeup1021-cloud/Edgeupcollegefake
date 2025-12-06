import PillNavbar from "@/components/student/PillNavbar";
import { ProtectedRoute } from "@/components/auth";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Top Navigation */}
        <PillNavbar />

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
