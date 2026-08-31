import { ReportApi } from "@/api/back";

// Manual extension for two endpoints the generated client doesn't know
// about yet (public-api-gateway#48 isn't deployed/regenerated against).
// Drop this once `report.reportControllerBulkHandleReports` etc show up
// in the generated ReportApi after the next `apigen` run.
export interface BulkHandleReportResult {
  processed: number;
  failed: number;
  failedIds: string[];
}

export interface BulkHandleReportPayload {
  ids?: string[];
  olderThanDays?: number;
  valid: boolean;
  overridePunishmentId?: number;
}

export class ReportBulkApi extends ReportApi {
  private authHeader(): Record<string, string> {
    const headers: Record<string, string> = {};
    const token = this.configuration?.accessToken;
    const tokenString =
      typeof token === "function" ? token("bearer", []) : token;
    if (tokenString) headers["Authorization"] = `Bearer ${tokenString}`;
    return headers;
  }

  previewBulkHandle = async (olderThanDays: number): Promise<number> => {
    const response = await this.request({
      path: "/v1/report/admin/bulk-handle/preview",
      method: "GET",
      headers: this.authHeader(),
      query: { olderThanDays },
    });
    const dto: { count: number } = await response.json();
    return dto.count;
  };

  bulkHandleReports = async (
    payload: BulkHandleReportPayload,
  ): Promise<BulkHandleReportResult> => {
    const response = await this.request({
      path: "/v1/report/admin/bulk-handle",
      method: "POST",
      headers: {
        ...this.authHeader(),
        "Content-Type": "application/json",
      },
      query: {},
      body: payload,
    });
    return response.json();
  };
}
