// lib/eventAnalytics.ts
// Event analytics and metrics calculations

import { Event, Registration } from "./database";

export interface EventMetrics {
  totalRegistered: number;
  capacity: number;
  registrationPercentage: number;
  spotsRemaining: number;
  isFull: boolean;
  isNearFull: boolean; // 80%+ filled
  capacityAlertLevel: "optimal" | "good" | "warning" | "critical";
}

export interface RegistrationTrend {
  date: string;
  count: number;
}

/**
 * Calculate key metrics for an event
 */
export function calculateEventMetrics(event: Event): EventMetrics {
  const registrationPercentage = event.capacity
    ? (event.registered / event.capacity) * 100
    : 0;

  const spotsRemaining = Math.max(0, event.capacity - event.registered);
  const isFull = event.capacity ? event.registered >= event.capacity : false;
  const isNearFull = registrationPercentage >= 80;

  let capacityAlertLevel: "optimal" | "good" | "warning" | "critical";
  if (isFull) {
    capacityAlertLevel = "critical";
  } else if (registrationPercentage >= 80) {
    capacityAlertLevel = "warning";
  } else if (registrationPercentage >= 50) {
    capacityAlertLevel = "good";
  } else {
    capacityAlertLevel = "optimal";
  }

  return {
    totalRegistered: event.registered,
    capacity: event.capacity,
    registrationPercentage,
    spotsRemaining,
    isFull,
    isNearFull,
    capacityAlertLevel,
  };
}

/**
 * Get color for capacity alert level
 */
export function getCapacityAlertColor(
  level: "optimal" | "good" | "warning" | "critical"
): string {
  switch (level) {
    case "optimal":
      return "success";
    case "good":
      return "primary";
    case "warning":
      return "warning";
    case "critical":
      return "danger";
    default:
      return "default";
  }
}

/**
 * Get alert message based on capacity
 */
export function getCapacityAlertMessage(metrics: EventMetrics): string | null {
  if (metrics.isFull) {
    return "Event is at full capacity! Consider increasing capacity or creating another session.";
  }
  if (metrics.isNearFull) {
    return `Event is ${Math.round(metrics.registrationPercentage)}% full - Consider promoting now!`;
  }
  if (metrics.registrationPercentage < 25) {
    return `Low registrations (${metrics.totalRegistered} out of ${metrics.capacity}). Boost promotion!`;
  }
  return null;
}

/**
 * Format metrics for display
 */
export function formatEventMetrics(metrics: EventMetrics): {
  registrationText: string;
  percentageText: string;
  alertMessage: string | null;
} {
  return {
    registrationText: `${metrics.totalRegistered}/${metrics.capacity}`,
    percentageText: `${Math.round(metrics.registrationPercentage)}%`,
    alertMessage: getCapacityAlertMessage(metrics),
  };
}

/**
 * Estimate future registrations based on current trend
 * Simple linear extrapolation (can be enhanced with ML later)
 * Supports both Registration array and simple number count
 */
export function estimateFutureRegistrations(
  registrationsOrCount: Registration[] | number,
  daysUntilEvent: number
): number {
  // If passed a number, use a conservative 10% growth rate
  if (typeof registrationsOrCount === 'number') {
    const currentCount = registrationsOrCount;
    if (currentCount === 0) return 0;
    // Assume ~10% weekly growth for simple estimation
    const weeklyGrowthRate = currentCount * 0.1;
    const weeksPassed = 1; // Assume 1 week of data
    const dailyGrowthRate = weeklyGrowthRate / 7;
    const estimated = currentCount + dailyGrowthRate * daysUntilEvent;
    return Math.round(Math.max(currentCount, estimated));
  }

  // Original logic for Registration array
  const registrations = registrationsOrCount;
  if (registrations.length === 0) return 0;

  // Sort by date
  const sorted = [...registrations].sort(
    (a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
  );

  const firstReg = new Date(sorted[0].registeredAt);
  const lastReg = new Date(sorted[sorted.length - 1].registeredAt);
  const daysPassed = (lastReg.getTime() - firstReg.getTime()) / (1000 * 60 * 60 * 24);

  if (daysPassed === 0) return registrations.length;

  // Linear growth rate
  const growthRate = registrations.length / daysPassed;
  const estimated = registrations.length + growthRate * daysUntilEvent;

  return Math.round(Math.max(registrations.length, estimated));
}

/**
 * Calculate registration growth rate (registrations per day)
 */
export function calculateGrowthRate(registrations: Registration[]): number {
  if (registrations.length < 2) return 0;

  const sorted = [...registrations].sort(
    (a, b) => new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
  );

  const firstDate = new Date(sorted[0].registeredAt);
  const lastDate = new Date(sorted[sorted.length - 1].registeredAt);
  const daysPassed = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysPassed === 0) return registrations.length;

  return Math.round((registrations.length / daysPassed) * 100) / 100; // registrations per day
}

/**
 * Group registrations by date for trending
 */
export function getRegistrationTrend(registrations: Registration[]): RegistrationTrend[] {
  const byDate: { [key: string]: number } = {};

  registrations.forEach((reg) => {
    const date = new Date(reg.registeredAt).toISOString().split("T")[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });

  return Object.entries(byDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
