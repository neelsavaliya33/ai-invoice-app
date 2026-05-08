"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "@/components/toast";
import { fetchPlanAddOns, fetchPlanModules, fetchPlans, fetchTrialConfig, type PlanAddOnResource, type PlanModuleResource, type PlanResource, type TrialConfigResource } from "@/lib/api";

export type UiPlan = {
  id: string;
  name: string;
  price: string;
  priceAmount: number | null;
  billingPeriod: string;
  companyLimit: number;
  companyLimitLabel: string;
  userLimit: number;
  userLimitLabel: string;
  aiCreditLimit: number;
  ewayBillLimit: number;
  trialDays: number;
  recommended: boolean;
  isFree: boolean;
  isCustom: boolean;
  ctaLabel: string;
  description: string;
  featureHighlights: string[];
  featureDetails: string[];
  modules: string[];
  capabilityCount: number;
};

export type UiPlanAddOn = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export type UiTrialConfig = TrialConfigResource;

function mapPlan(plan: PlanResource): UiPlan {
  const isFree = plan.price.amount === 0;
  const isCustom = plan.price.amount === null || plan.billingPeriod === "custom";
  const featureHighlights = plan.features
    .filter((feature) => feature.group === "highlight")
    .map((feature) => feature.title);
  const featureDetails = plan.features
    .filter((feature) => feature.group === "included")
    .map((feature) => feature.description || feature.title);

  return {
    id: plan.code,
    name: plan.name,
    price: plan.price.display,
    priceAmount: plan.price.amount,
    billingPeriod: plan.billingLabel || plan.billingPeriod,
    companyLimit: plan.companyLimit,
    companyLimitLabel: `${plan.companyLimit}${isCustom ? "+" : ""} compan${plan.companyLimit > 1 || isCustom ? "ies" : "y"}`,
    userLimit: plan.userLimit,
    userLimitLabel: `${plan.userLimit}${isCustom ? "+" : ""} user${plan.userLimit > 1 || isCustom ? "s" : ""}`,
    aiCreditLimit: plan.aiCreditLimit,
    ewayBillLimit: plan.ewayBillLimit,
    trialDays: plan.trialDays,
    recommended: plan.recommended,
    isFree,
    isCustom,
    ctaLabel: isFree ? "Start Free" : isCustom ? "Contact sales" : "Start trial",
    description: plan.description,
    featureHighlights,
    featureDetails,
    modules: plan.modules.map((module) => module.name),
    capabilityCount: plan.modules.reduce((total, module) => total + module.capabilities.length, 0),
  };
}

export function useTrialConfig() {
  const query = useQuery({
    queryKey: ["trial-config"],
    queryFn: fetchTrialConfig,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    trialConfig: query.data,
  };
}

function mapAddOn(addOn: PlanAddOnResource): UiPlanAddOn {
  return {
    id: addOn.code,
    name: addOn.name,
    price: addOn.billingLabel ? `${addOn.price.display}/${addOn.billingLabel}` : addOn.price.display,
    description: addOn.description,
  };
}

export function usePlans() {
  const query = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const apiPlans = Array.isArray(query.data) ? query.data.map(mapPlan) : [];

  useEffect(() => {
    if (!query.isError) return;
    const errorMessage = query.error instanceof Error ? query.error.message : "Plans could not be loaded.";
    toast({
      tone: "error",
      title: "Pricing plans unavailable",
      description: errorMessage,
    });
  }, [query.error, query.isError]);

  return {
    ...query,
    plans: apiPlans,
    hasPlans: apiPlans.length > 0,
  };
}

export function usePlanAddOns() {
  const query = useQuery({
    queryKey: ["plan-add-ons"],
    queryFn: fetchPlanAddOns,
  });

  const apiAddOns = Array.isArray(query.data) ? query.data.map(mapAddOn) : [];

  useEffect(() => {
    if (!query.isError) return;
    const errorMessage = query.error instanceof Error ? query.error.message : "Add-ons could not be loaded.";
    toast({
      tone: "error",
      title: "Add-ons unavailable",
      description: errorMessage,
    });
  }, [query.error, query.isError]);

  return {
    ...query,
    addOns: apiAddOns,
    hasAddOns: apiAddOns.length > 0,
  };
}

export function usePlanModules() {
  const query = useQuery({
    queryKey: ["plan-modules"],
    queryFn: fetchPlanModules,
  });

  const modules = Array.isArray(query.data) ? query.data : [];

  useEffect(() => {
    if (!query.isError) return;
    const errorMessage = query.error instanceof Error ? query.error.message : "Plan modules could not be loaded.";
    toast({
      tone: "error",
      title: "Permission catalog unavailable",
      description: errorMessage,
    });
  }, [query.error, query.isError]);

  return {
    ...query,
    modules: modules as PlanModuleResource[],
    hasModules: modules.length > 0,
  };
}
