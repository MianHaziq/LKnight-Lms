"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { subscriptionApi, SubscriptionInfo, User } from "@/lib/api";

interface TeamMember {
  id: string;
  user: User;
  role: string;
  joinedAt: string;
}

export default function SubscriptionManagementPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancel state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Team member add state
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  // Remove member state
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin?redirect=/dashboard/subscription");
      return;
    }
    if (user) {
      fetchSubscription();
    }
  }, [user, authLoading]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionApi.getMySubscription();
      if (response.success && response.data) {
        setSubscription(response.data);
        // Fetch team members for team plans
        if (response.data.maxUsers > 1 && !response.data.isTeamMember) {
          fetchTeamMembers(response.data.id);
        }
      }
    } catch (err) {
      setError("Failed to load subscription details.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async (subscriptionId: string) => {
    try {
      const response = await subscriptionApi.getTeamMembers(subscriptionId);
      if (response.success && response.data) {
        setTeamMembers(response.data);
      }
    } catch {
      // Non-critical — team members just won't show
    }
  };

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      const response = await subscriptionApi.cancel();
      if (response.success) {
        setSubscription((prev) =>
          prev
            ? {
                ...prev,
                cancelAtPeriodEnd: true,
                currentPeriodEnd: response.data?.currentPeriodEnd || prev.currentPeriodEnd,
              }
            : null
        );
        setShowCancelConfirm(false);
      }
    } catch {
      setError("Failed to cancel subscription. Please try again or contact support.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscription || !memberEmail.trim()) return;

    try {
      setAddMemberLoading(true);
      setAddMemberError(null);
      await subscriptionApi.addTeamMember(subscription.id, memberEmail.trim());
      setMemberEmail("");
      setShowAddMember(false);
      fetchTeamMembers(subscription.id);
    } catch (err) {
      setAddMemberError(
        err instanceof Error ? err.message : "Failed to add team member."
      );
    } finally {
      setAddMemberLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!subscription) return;
    try {
      setRemovingMemberId(memberId);
      await subscriptionApi.removeTeamMember(subscription.id, memberId);
      setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch {
      setError("Failed to remove team member.");
    } finally {
      setRemovingMemberId(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "TRIALING":
        return "bg-green-100 text-green-700";
      case "PAST_DUE":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELED":
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // No active subscription
  if (!subscription) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#000E51] mb-3">No Active Subscription</h1>
          <p className="text-gray-500 mb-6">
            You don&apos;t have an active subscription yet. Choose a plan to get full access to all courses.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-3 bg-[#FF6F00] hover:bg-[#E86400] text-white font-semibold rounded-xl transition-all duration-200"
          >
            View Plans
          </Link>
        </div>
      </div>
    );
  }

  const isTeamPlan = subscription.maxUsers > 1;
  const isOwner = !subscription.isTeamMember;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#000E51]">
          My Subscription
        </h1>
        <p className="text-gray-500 mt-1">Manage your plan and billing</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Subscription Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-[#000E51]">
                  {subscription.plan.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(subscription.status)}`}>
                  {subscription.status}
                </span>
              </div>
              {subscription.isTeamMember && (
                <p className="text-sm text-gray-500">
                  You are a {subscription.memberRole || "member"} of this team plan
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#000E51]">
                {subscription.billingCycle === "MONTHLY"
                  ? `$${subscription.plan.monthlyPrice}`
                  : `$${subscription.plan.yearlyPrice}`}
              </p>
              <p className="text-sm text-gray-500">
                per {subscription.billingCycle === "MONTHLY" ? "month" : "year"}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Billing Cycle</p>
              <p className="text-sm font-semibold text-[#000E51]">
                {subscription.billingCycle === "MONTHLY" ? "Monthly" : "Yearly"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current Period</p>
              <p className="text-sm font-semibold text-[#000E51]">
                {formatDate(subscription.currentPeriodStart)} — {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
            {isTeamPlan && (
              <>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Team Seats</p>
                  <p className="text-sm font-semibold text-[#000E51]">
                    {subscription.memberCount || teamMembers.length} / {subscription.maxUsers} used
                  </p>
                </div>
                {subscription.organizationName && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Organization</p>
                    <p className="text-sm font-semibold text-[#000E51]">
                      {subscription.organizationName}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cancel Notice */}
          {subscription.cancelAtPeriodEnd && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-6">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Cancellation scheduled.</span>{" "}
                Your subscription will remain active until{" "}
                <span className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</span>.
                You will retain full access until then.
              </p>
            </div>
          )}

          {/* Actions */}
          {isOwner && (
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="px-5 py-2.5 bg-[#000E51] hover:bg-[#001570] text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Change Plan
              </Link>
              {!subscription.cancelAtPeriodEnd && subscription.status === "ACTIVE" && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-5 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-xl text-sm transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#000E51] mb-2">Cancel Subscription?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Your subscription will remain active until{" "}
              <span className="font-semibold">{formatDate(subscription.currentPeriodEnd)}</span>.
              After that, you will lose access to all courses.
              You can resubscribe at any time.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl text-sm transition-colors"
                disabled={isCancelling}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Members Section */}
      {isTeamPlan && isOwner && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#000E51]">Team Members</h2>
              {teamMembers.length < subscription.maxUsers && (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="px-4 py-2 bg-[#FF6F00] hover:bg-[#E86400] text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  + Add Member
                </button>
              )}
            </div>

            {/* Add Member Form */}
            {showAddMember && (
              <form onSubmit={handleAddMember} className="mb-6 p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite by email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={addMemberLoading}
                    className="px-5 py-2.5 bg-[#000E51] hover:bg-[#001570] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
                  >
                    {addMemberLoading ? "Adding..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMember(false);
                      setAddMemberError(null);
                      setMemberEmail("");
                    }}
                    className="px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {addMemberError && (
                  <p className="text-red-500 text-sm mt-2">{addMemberError}</p>
                )}
              </form>
            )}

            {/* Member List */}
            {teamMembers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No team members added yet. Invite your team to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#000E51] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.user.firstName?.[0]}
                        {member.user.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#000E51]">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{member.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 capitalize">{member.role}</span>
                      {member.role !== "owner" && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={removingMemberId === member.id}
                          className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          {removingMemberId === member.id ? "Removing..." : "Remove"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Seats info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {teamMembers.length} of {subscription.maxUsers} seats used
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
