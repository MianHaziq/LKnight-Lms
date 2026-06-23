/**
 * In-memory cache for team and plans data.
 * Prefetched in the background when the app loads so About and Pricing pages can show instantly.
 */

import { teamApi, planApi } from "./api";
import type { TeamMember } from "./api";
import type { Plan } from "./api";

type CacheEntry<T> = { data: T; timestamp: number } | null;

const STALE_MS = 5 * 60 * 1000; // 5 minutes

const cache: {
  team: CacheEntry<TeamMember[]>;
  plans: CacheEntry<Plan[]>;
} = {
  team: null,
  plans: null,
};

function isStale(entry: CacheEntry<unknown>): boolean {
  if (!entry) return true;
  return Date.now() - entry.timestamp > STALE_MS;
}

export const prefetchCache = {
  getTeam(): TeamMember[] | null {
    if (!cache.team || isStale(cache.team)) return null;
    return cache.team.data;
  },

  setTeam(data: TeamMember[]): void {
    cache.team = { data, timestamp: Date.now() };
  },

  getPlans(): Plan[] | null {
    if (!cache.plans || isStale(cache.plans)) return null;
    return cache.plans.data;
  },

  setPlans(data: Plan[]): void {
    cache.plans = { data, timestamp: Date.now() };
  },

  /** Fire-and-forget: prefetch team in background. */
  prefetchTeam(): void {
    teamApi
      .getAll()
      .then((res) => {
        if (res.success && res.data) prefetchCache.setTeam(res.data);
      })
      .catch(() => {});
  },

  /** Fire-and-forget: prefetch plans in background. */
  prefetchPlans(): void {
    planApi
      .getAll()
      .then((res) => {
        if (res.success && res.data) prefetchCache.setPlans(res.data);
      })
      .catch(() => {});
  },

  /** Prefetch both; call once when app mounts. */
  prefetchAll(): void {
    prefetchCache.prefetchTeam();
    prefetchCache.prefetchPlans();
  },
};
