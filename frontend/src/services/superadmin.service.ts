import { api } from "./api.client";
import type { SuperadminDashboard, SuperadminOverview } from "@/types/superadmin.types";

export class SuperadminService {
  /**
   * Get superadmin overview data
   */
  static async getOverview(): Promise<SuperadminOverview> {
    return api.get<SuperadminOverview>("/superadmin/overview");
  }

  /**
   * Get full superadmin dashboard data
   */
  static async getDashboard(): Promise<SuperadminDashboard> {
    return api.get<SuperadminDashboard>("/superadmin/dashboard");
  }
}
