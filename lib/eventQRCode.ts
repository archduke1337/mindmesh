// lib/eventQRCode.ts
// QR Code generation for event check-ins

/**
 * Generate QR code URL for event using a free QR code API
 * Encodes event details for venue check-in scanning
 */
export function generateEventQRCodeUrl(eventId: string, eventTitle: string): string {
  const data = `EVENT|${eventId}|${eventTitle}|${Date.now()}`;
  
  // Using qr-server.com free API (no key required)
  // Encodes the data as query params
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
}

/**
 * Generate a shareable event QR code that links to event registration page
 */
export function generateEventShareQRCodeUrl(eventId: string): string {
  const eventUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://mindmesh.club'}/events/${eventId}`;
  const encoded = encodeURIComponent(eventUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
}

/**
 * Generate check-in QR code data
 */
export function generateCheckInCode(eventId: string, userId: string): string {
  return `CHECK_IN|${eventId}|${userId}|${Date.now()}`;
}
