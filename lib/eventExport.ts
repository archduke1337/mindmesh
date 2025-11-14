// lib/eventExport.ts
// Export event statistics to CSV and other formats

import { Event, Registration } from "./database";
import { EventMetrics } from "./eventAnalytics";

/**
 * Generate CSV content for event statistics
 */
export function generateEventStatsCSV(
  event: Event,
  metrics: EventMetrics,
  registrations: Registration[]
): string {
  const lines: string[] = [];

  // Header
  lines.push("MindMesh Event Statistics Report");
  lines.push("================================\n");

  // Event Info
  lines.push("EVENT INFORMATION");
  lines.push(`Title,${event.title}`);
  lines.push(`Date,${event.date}`);
  lines.push(`Time,${event.time}`);
  lines.push(`Location,${event.location}`);
  lines.push(`Category,${event.category}`);
  lines.push(`Price,$${event.price}`);
  if (event.discountPrice) {
    lines.push(`Discount Price,$${event.discountPrice}`);
  }
  lines.push("");

  // Statistics
  lines.push("REGISTRATION STATISTICS");
  lines.push(`Total Registered,${metrics.totalRegistered}`);
  lines.push(`Capacity,${metrics.capacity}`);
  lines.push(`Registration %,${Math.round(metrics.registrationPercentage)}%`);
  lines.push(`Spots Remaining,${metrics.spotsRemaining}`);
  lines.push(`Full,${metrics.isFull ? "Yes" : "No"}`);
  lines.push("");

  // Revenue
  const totalRevenue = registrations.reduce((sum, reg) => {
    const price = event.discountPrice || event.price;
    return sum + price;
  }, 0);

  lines.push("REVENUE METRICS");
  lines.push(`Unit Price,$${event.discountPrice || event.price}`);
  lines.push(`Total Revenue,$${totalRevenue}`);
  lines.push(`Average Revenue Per Attendee,$${totalRevenue > 0 ? (totalRevenue / registrations.length).toFixed(2) : 0}`);
  lines.push("");

  // Registrations Table
  lines.push("DETAILED REGISTRATIONS");
  lines.push("User Name,Email,Registered At");
  registrations.forEach((reg) => {
    const date = new Date(reg.registeredAt).toLocaleString();
    lines.push(`"${reg.userName}","${reg.userEmail}","${date}"`);
  });

  return lines.join("\n");
}

/**
 * Trigger CSV download
 */
export function downloadEventStatsCSV(
  event: Event,
  metrics: EventMetrics,
  registrations: Registration[]
): void {
  const csv = generateEventStatsCSV(event, metrics, registrations);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}_stats.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate registration list for export
 */
export function generateRegistrationList(registrations: Registration[]): string {
  const lines: string[] = [];
  lines.push("Registered Users Report");
  lines.push("=======================\n");
  lines.push("Name,Email,Registration Date\n");

  registrations.forEach((reg) => {
    const date = new Date(reg.registeredAt).toLocaleDateString();
    lines.push(`${reg.userName},${reg.userEmail},${date}`);
  });

  return lines.join("\n");
}

/**
 * Trigger registration list download
 */
export function downloadRegistrationList(eventTitle: string, registrations: Registration[]): void {
  const content = generateRegistrationList(registrations);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${eventTitle.replace(/\s+/g, "_")}_registrations.txt`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate shareable stats summary
 */
export function generateStatsShareText(event: Event, metrics: EventMetrics): string {
  return `🎉 ${event.title}\n📍 ${event.location}\n📅 ${event.date}\n\n` +
    `👥 ${metrics.totalRegistered}/${metrics.capacity} registered (${Math.round(metrics.registrationPercentage)}%)\n` +
    `💰 $${event.price}${event.discountPrice ? ` (on sale: $${event.discountPrice})` : ''}\n\n` +
    `Register: https://mindmesh.club/events/${event.$id}`;
}
