import { apiClient } from "./api.client";
import type { SuperadminDashboard, SuperadminOverview } from "@/types/superadmin.types";

export class SuperadminService {
  /**
   * Get superadmin overview data
   */
  static async getOverview(): Promise<SuperadminOverview> {
    return apiClient.get<SuperadminOverview>("/superadmin/overview");
  }

  /**
   * Get full superadmin dashboard data
   */
  static async getDashboard(): Promise<SuperadminDashboard> {
    return apiClient.get<SuperadminDashboard>("/superadmin/dashboard");
  }
}
