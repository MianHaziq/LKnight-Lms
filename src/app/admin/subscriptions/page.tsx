"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import Badge from "@/components/admin/Badge";
import { dashboardApi, SubscriptionRecord } from "@/lib/api";

const limit = 10;

export default function SubscriptionsPage() {
  const [list, setList] = useState<SubscriptionRecord[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await dashboardApi.getSubscriptionsList(page, limit);
      if (res.success && res.data) {
        setList(Array.isArray(res.data) ? res.data : []);
        if (res.pagination) {
          setTotal(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscriptions");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const escapeCsv = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;

  const exportCsv = () => {
    if (list.length === 0) return;
    const headers = "Name,Email,Plan,Billing Cycle,Amount (USD),Date,Status\n";
    const rows = list.map((sub) => {
      const name = `${sub.user?.firstName || ""} ${sub.user?.lastName || ""}`.trim();
      const email = sub.user?.email || "";
      const plan = sub.planName || "";
      const amount = typeof sub.amount === "number" ? sub.amount.toFixed(2) : sub.amount;
      const date = sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : "";
      const status = sub.status || "";
      return [escapeCsv(name), escapeCsv(email), escapeCsv(plan), escapeCsv(sub.billingCycle || ""), amount, escapeCsv(date), escapeCsv(status)].join(",");
    }).join("\n");
    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscriptions-page-${page}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${(firstName || "").charAt(0)}${(lastName || "").charAt(0)}`.toUpperCase() || "?";

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Plan Enrollments
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Users and their subscription plans
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={list.length === 0}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            }
          >
            Export CSV
          </AdminButton>
          <Link href="/admin">
            <AdminButton variant="ghost" size="sm">
              Back to Dashboard
            </AdminButton>
          </Link>
        </div>
      </div>

      <AdminCard title="" subtitle="" padding="none">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No subscriptions found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Billing
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {list.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary text-sm font-semibold">
                              {getInitials(sub.user?.firstName || "", sub.user?.lastName || "")}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 text-sm">
                            {sub.user?.firstName} {sub.user?.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 hidden sm:table-cell">
                        {sub.user?.email}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-primary">
                        {sub.planName}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="gray" size="sm">
                          {sub.billingCycle}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 text-sm">
                        ${typeof sub.amount === "number" ? sub.amount.toFixed(2) : sub.amount}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm hidden md:table-cell">
                        {sub.subscribedAt
                          ? new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={sub.status === "ACTIVE" ? "success" : sub.status === "TRIALING" ? "primary" : "gray"}
                          size="sm"
                        >
                          {sub.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                  >
                    Previous
                  </AdminButton>
                  <span className="text-sm text-gray-600 px-2">
                    Page {page} of {totalPages}
                  </span>
                  <AdminButton
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!hasNext}
                  >
                    Next
                  </AdminButton>
                </div>
              </div>
            )}
          </>
        )}
      </AdminCard>
    </div>
  );
}
