// lib/eventQRCode.ts
// QR Code generation for event check-ins

/**
 * Generate individual ticket QR code for venue check-in
 * Each attendee gets a unique QR code with their ticket info
 */
export function generateTicketQRCodeUrl(ticketId: string, userName: string, eventTitle: string): string {
  const ticketData = `TICKET|${ticketId}|${userName}|${eventTitle}`;
  const encoded = encodeURIComponent(ticketData);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
}

/**
 * Generate master event QR code for organizers
 * Used to display at venue for general information (deprecated - use ticketQRCodeUrl instead)
 */
export function generateEventQRCodeUrl(eventId: string, eventTitle: string): string {
  const data = `EVENT|${eventId}|${eventTitle}`;
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
 * Generate check-in QR code data for API processing
 */
export function generateCheckInCode(ticketId: string): string {
  return `CHECK_IN|${ticketId}|${new Date().toISOString()}`;
}
