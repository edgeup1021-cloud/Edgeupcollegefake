import { ProtectedRoute } from "@/components/auth";
import TopNavbar from "@/components/teacher/TopNavbar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <TopNavbar />
        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
      </div>
    </ProtectedRoute>
  );

}
