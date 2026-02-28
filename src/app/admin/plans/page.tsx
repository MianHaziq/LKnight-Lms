"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import Badge from "@/components/admin/Badge";
import { planApi, Plan } from "@/lib/api";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await planApi.getAllAdmin();
      if (response.success && response.data) {
        setPlans(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
      setError("Failed to load plans");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await planApi.delete(id);
      if (response.success) {
        setPlans((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete plan. It may have active subscriptions.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined) return "—";
    return `$${price.toLocaleString()}`;
  };

  const totalSubscriptions = plans.reduce((sum, p) => sum + (p.subscriptionCount || 0), 0);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-32" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 h-24" />
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Plan Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage subscription plans and pricing
          </p>
        </div>
        <AdminButton
          variant="secondary"
          href="/admin/plans/new"
          size="sm"
          className="self-start sm:self-auto"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Add Plan
        </AdminButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Total Plans</p>
          <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5 sm:mt-1">
            {plans.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Active Plans</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">
            {plans.filter((p) => p.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hidden sm:block">
          <p className="text-xs sm:text-sm text-gray-500">Active Subscriptions</p>
          <p className="text-xl sm:text-2xl font-bold text-secondary mt-0.5 sm:mt-1">
            {totalSubscriptions}
          </p>
        </div>
      </div>

      {/* Plans Table */}
      <AdminCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Monthly</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Yearly</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Max Users</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">CTA Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Subs</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    No plans created yet.{" "}
                    <Link href="/admin/plans/new" className="text-secondary hover:underline">
                      Create your first plan
                    </Link>
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-gray-400 font-mono text-xs">{plan.order}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{plan.name}</p>
                        <p className="text-xs text-gray-400">/{plan.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-gray-700">{formatPrice(plan.monthlyPrice)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">{formatPrice(plan.yearlyPrice)}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-gray-700">{plan.maxUsers.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge variant={plan.ctaType === "CHECKOUT" ? "success" : "primary"} size="sm">
                        {plan.ctaType === "CHECKOUT" ? "Checkout" : "Contact Sales"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={plan.isActive ? "success" : "gray"} size="sm">
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-gray-700">{plan.subscriptionCount || 0}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          href={`/admin/plans/${plan.id}`}
                          icon={
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          }
                        >
                          Edit
                        </AdminButton>
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => setDeleteConfirm(plan.id)}
                          icon={
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          }
                        >
                          Delete
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-sm w-full p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 sm:w-6 sm:h-6">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-1.5 sm:mb-2">
              Delete Plan?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6">
              This action cannot be undone. Plans with active subscriptions cannot be deleted.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <AdminButton variant="outline" className="flex-1" size="sm" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </AdminButton>
              <AdminButton variant="danger" className="flex-1" size="sm" onClick={() => handleDelete(deleteConfirm)} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
