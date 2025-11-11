# Ticket System Documentation

## Overview

The ticket system in MindMesh is a comprehensive event registration and ticket management solution that synchronizes between the frontend (localStorage) and backend (Appwrite database).

## Architecture

### Database Schema

**Collection: `registrations`**
```typescript
interface Registration {
  $id?: string;                 // Unique document ID (also used as ticketId)
  eventId: string;              // Reference to event
  userId: string;               // Reference to user
  userName: string;             // User's name
  userEmail: string;            // User's email
  registeredAt: string;         // ISO timestamp of registration
  userPhone?: string;           // Optional phone number
  status?: string;              // Optional status field
  $createdAt?: string;          // Appwrite metadata
  $updatedAt?: string;          // Appwrite metadata
}
```

### Frontend Interface

**Ticket Interface (app/tickets/page.tsx)**
```typescript
interface Ticket {
  ticketId: string | undefined;    // Registration document ID
  eventId: string;                 // Event ID
  eventTitle: string;              // Event title (from event details)
  userName: string;                // User name
  userEmail: string;               // User email
  date: string;                    // Event date (from event details)
  time: string;                    // Event time (from event details)
  venue: string;                   // Event venue (from event details)
  location: string;                // Event location (from event details)
  registeredAt: string;            // Registration timestamp
  price?: number;                  // Event price (optional, from event details)
  discountPrice?: number | null;   // Event discount price (optional, from event details)
}
```

## Registration Flow

### Step 1: User Registration (app/events/page.tsx)

When a user clicks the register button on an event:

1. **Validation**: Check if user is logged in and not already registered
2. **Database Write**: Call `eventService.registerForEvent()`
   - Creates a new document in `registrations` collection
   - Stores: eventId, userId, userName, userEmail, registeredAt
   - Updates event's registered count
3. **Email**: Sends registration confirmation email with ticket
4. **LocalStorage Cache**: Stores ticket data locally for offline access
   - Stores as `ticket_${eventId}` for quick access
   - Stores event IDs in `registeredEvents` array for lookup

```typescript
// Database registration
const registration = await eventService.registerForEvent(eventId, user.$id, user.name, user.email);

// LocalStorage backup
localStorage.setItem(`ticket_${eventId}`, JSON.stringify(ticketData));
localStorage.setItem("registeredEvents", JSON.stringify(newRegistered));
```

## Ticket Retrieval Flow

### Priority 1: Database (app/tickets/page.tsx)

When user navigates to `/tickets`:

1. **Load from Database**: Calls `eventService.getUserTickets(userId)`
   - Fetches all registrations for user
   - Enriches with event details (title, date, time, venue, location)
   - Returns array of Ticket objects
   - **Result**: Persistent, synced across devices

2. **Fallback to LocalStorage**: If database fails or is empty
   - Reads from localStorage caches
   - Reconstructs tickets from local data
   - **Result**: Works offline, even if database is down

```typescript
// Attempt database
const databaseTickets = await eventService.getUserTickets(user.$id);

// Fallback if database fails
const allTickets: Ticket[] = [];
registeredEvents.forEach((eventId: string) => {
  const ticketData = localStorage.getItem(`ticket_${eventId}`);
  if (ticketData) allTickets.push(JSON.parse(ticketData));
});
```

## Service Methods

### In `lib/database.ts` (eventService)

#### `registerForEvent(eventId, userId, userName, userEmail)`
- **Purpose**: Create a new registration in database
- **Returns**: Registration object with $id
- **Side Effects**: Increments event's registered count
- **Throws**: Error if already registered or event is full

#### `getUserTickets(userId)`
- **Purpose**: Fetch all tickets for a user with event details
- **Returns**: Array of enriched Ticket objects
- **Process**:
  1. Calls `getUserRegistrations(userId)`
  2. For each registration, fetches event details
  3. Merges registration + event data into Ticket format
- **Error Handling**: Gracefully handles missing events

#### `getUserRegistrations(userId)`
- **Purpose**: Fetch all registrations for a user
- **Returns**: Array of Registration objects
- **Ordering**: Sorted by registeredAt (newest first)

#### `getTicketById(ticketId)`
- **Purpose**: Fetch a single ticket with full details
- **Returns**: Single enriched Ticket object
- **Use Case**: Viewing specific ticket details

#### `isUserRegistered(eventId, userId)`
- **Purpose**: Check if user is registered for specific event
- **Returns**: Boolean
- **Use Case**: Button state (register vs unregister)

## Client-Side Features

### Tickets Page (`app/tickets/page.tsx`)

**Features:**
- View all user's registered event tickets
- Download ticket as text file
- Print ticket in printer-friendly format
- Share ticket via link or social media
- View ticket details in modal
- Create test ticket (for demo/development)

**States:**
- **Loading**: Shows spinner while fetching
- **Empty**: Shows troubleshooting guide if no tickets
- **List**: Grid view of all tickets
- **Detail**: Modal with full ticket information

### Key UI Components

1. **Ticket Card**: Shows event title, date, time, location
2. **Download Button**: Downloads ticket as `.txt` file
3. **Print Button**: Opens print dialog
4. **Share Button**: Shares ticket details
5. **Test Ticket Button**: Creates demo ticket (development)

## Data Sync Strategy

### Write Path (Registration)
```
User Register → Database Write → Email Send → LocalStorage Cache
```

### Read Path (Viewing)
```
User View Tickets → Try Database → Fallback to LocalStorage → Display
```

### Conflict Resolution
- **Database has priority**: If both sources have data, database is authoritative
- **Fallback only**: LocalStorage is used only if database unavailable
- **Auto-sync**: New registrations immediately update localStorage

## Offline Support

The ticket system works offline through localStorage caching:

1. **Online Scenario**: 
   - Register → writes to database + localStorage
   - View tickets → reads from database

2. **Offline Scenario**:
   - Can't register (needs server)
   - Can view previous tickets from localStorage
   - Works until localStorage is cleared

3. **Partial Connectivity**:
   - Database fails → gracefully falls back to localStorage
   - User informed via console logs
   - Tickets still display from cache

## Debugging

### Console Logs

The system includes comprehensive logging:

```typescript
// Database operations
console.log("🔄 Loading tickets from database for user:", user.$id);
console.log("✅ Tickets loaded from database:", databaseTickets.length);

// Fallback operations
console.log("⚠️ Database error, falling back to localStorage:", error);
console.log("📱 Falling back to localStorage...");
console.log("📋 Registered Events from localStorage:", registeredEvents);

// Event registration
console.log("🔄 Registering for event:", eventId);
console.log("✅ Database registration successful:", registration);
```

### Troubleshooting

**No tickets appearing?**
1. Check browser console for errors
2. Verify user is registered for events on `/events` page
3. Create test ticket using "Create Test Ticket" button
4. Check localStorage: `DevTools > Storage > Local Storage > registeredEvents`

**Cross-device sync not working?**
1. Verify Appwrite database connectivity
2. Check network tab for API calls
3. Ensure same user ID across devices
4. Check REGISTRATIONS_COLLECTION_ID is correct

**Tickets disappearing after refresh?**
1. Database write may have failed - check console
2. LocalStorage may have been cleared
3. Check if registration event still exists
4. Create test ticket to verify display works

## Future Enhancements

1. **Real-time Updates**: WebSocket sync for live registration updates
2. **Ticket Redemption**: Track which tickets have been scanned/used
3. **Cancellation**: Cancel registration and remove ticket
4. **Export Options**: PDF, QR code, email forwarding
5. **Analytics**: Track attendance, no-shows, cancellations
6. **Notifications**: Email/SMS reminders before event
7. **Transfer**: Allow ticket transfer to another user

## Configuration

### Collection IDs (config in lib/database.ts)
```typescript
const DATABASE_ID = "68ee09da002cce9f7e39";
const REGISTRATIONS_COLLECTION_ID = "registrations";
const EVENTS_COLLECTION_ID = "events";
```

### localStorage Keys
```typescript
"registeredEvents"        // Array of eventIds user registered for
`ticket_${eventId}`       // Specific ticket data for offline access
```

### Environment Variables
None required - uses existing Appwrite configuration
