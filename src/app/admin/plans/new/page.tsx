"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import AdminSelect from "@/components/admin/AdminSelect";
import { planApi, PlanFeature } from "@/lib/api";

export default function CreatePlanPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tagline: "",
    closeLine: "",
    monthlyPrice: "",
    yearlyPrice: "",
    maxUsers: "1",
    additionalUserPrice: "",
    ctaText: "Get Started",
    ctaType: "CHECKOUT",
    isPopular: false,
    isActive: true,
    stripeMonthlyPriceId: "",
    stripeYearlyPriceId: "",
    stripeProductId: "",
  });

  const [features, setFeatures] = useState<PlanFeature[]>([
    { text: "", included: true },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        tagline: formData.tagline || undefined,
        closeLine: formData.closeLine || undefined,
        monthlyPrice: formData.monthlyPrice ? parseFloat(formData.monthlyPrice) : null,
        yearlyPrice: formData.yearlyPrice ? parseFloat(formData.yearlyPrice) : null,
        maxUsers: parseInt(formData.maxUsers) || 1,
        additionalUserPrice: formData.additionalUserPrice ? parseFloat(formData.additionalUserPrice) : null,
        ctaText: formData.ctaText,
        ctaType: formData.ctaType as "CHECKOUT" | "CONTACT_SALES",
        isPopular: formData.isPopular,
        isActive: formData.isActive,
        stripeMonthlyPriceId: formData.stripeMonthlyPriceId || null,
        stripeYearlyPriceId: formData.stripeYearlyPriceId || null,
        stripeProductId: formData.stripeProductId || null,
        features: features.filter((f) => f.text.trim()),
      };

      const response = await planApi.create(payload);
      if (response.success) {
        router.push("/admin/plans");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plan");
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    setFeatures([...features, { text: "", included: true }]);
  };

  const updateFeature = (index: number, field: keyof PlanFeature, value: string | boolean) => {
    setFeatures((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <AdminButton variant="ghost" size="sm" href="/admin/plans" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        }>
          Back
        </AdminButton>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Create New Plan
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Add a new subscription plan
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <AdminCard>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <AdminInput
              label="Plan Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Individual Plan"
              required
            />
            <AdminInput
              label="Tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g., Growth starts with one."
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Plan description for the pricing page"
                rows={3}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Close Line</label>
              <textarea
                value={formData.closeLine}
                onChange={(e) => setFormData({ ...formData, closeLine: e.target.value })}
                placeholder="Closing paragraph displayed below the features"
                rows={2}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
          </div>
        </AdminCard>

        {/* Pricing */}
        <AdminCard>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Monthly Price"
              type="number"
              value={formData.monthlyPrice}
              onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
              placeholder="Leave empty for yearly-only"
              helperText="Leave blank if no monthly option"
            />
            <AdminInput
              label="Yearly Price"
              type="number"
              value={formData.yearlyPrice}
              onChange={(e) => setFormData({ ...formData, yearlyPrice: e.target.value })}
              placeholder="e.g., 290"
            />
            <AdminInput
              label="Max Users"
              type="number"
              value={formData.maxUsers}
              onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
              placeholder="1"
              required
            />
            <AdminInput
              label="Additional User Price"
              type="number"
              value={formData.additionalUserPrice}
              onChange={(e) => setFormData({ ...formData, additionalUserPrice: e.target.value })}
              placeholder="Price per extra user"
              helperText="For team/org plans only"
            />
          </div>
        </AdminCard>

        {/* CTA & Display */}
        <AdminCard>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">CTA & Display</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="CTA Button Text"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              placeholder="e.g., Start with Individual"
            />
            <AdminSelect
              label="CTA Type"
              value={formData.ctaType}
              onChange={(e) => setFormData({ ...formData, ctaType: e.target.value })}
              options={[
                { value: "CHECKOUT", label: "Stripe Checkout" },
                { value: "CONTACT_SALES", label: "Contact Sales" },
              ]}
            />
          </div>
          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Mark as Popular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        </AdminCard>

        {/* Features */}
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Features</h2>
            <AdminButton variant="ghost" size="sm" onClick={addFeature} icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }>
              Add Feature
            </AdminButton>
          </div>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <label className="flex items-center gap-2 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={feature.included}
                    onChange={(e) => updateFeature(index, "included", e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xs text-gray-500 w-16">{feature.included ? "Included" : "Excluded"}</span>
                </label>
                <input
                  type="text"
                  value={feature.text}
                  onChange={(e) => updateFeature(index, "text", e.target.value)}
                  placeholder="Feature description"
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Stripe IDs */}
        <AdminCard>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stripe Configuration</h2>
          <p className="text-xs text-gray-400 mb-4">
            Link this plan to Stripe products and prices for checkout.
          </p>
          <div className="space-y-4">
            <AdminInput
              label="Stripe Product ID"
              value={formData.stripeProductId}
              onChange={(e) => setFormData({ ...formData, stripeProductId: e.target.value })}
              placeholder="prod_..."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Stripe Monthly Price ID"
                value={formData.stripeMonthlyPriceId}
                onChange={(e) => setFormData({ ...formData, stripeMonthlyPriceId: e.target.value })}
                placeholder="price_..."
              />
              <AdminInput
                label="Stripe Yearly Price ID"
                value={formData.stripeYearlyPriceId}
                onChange={(e) => setFormData({ ...formData, stripeYearlyPriceId: e.target.value })}
                placeholder="price_..."
              />
            </div>
          </div>
        </AdminCard>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <AdminButton variant="outline" href="/admin/plans">
            Cancel
          </AdminButton>
          <AdminButton variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? "Creating..." : "Create Plan"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
