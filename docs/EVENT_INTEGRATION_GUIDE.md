# Event Management System - Complete Integration Guide

## Overview

MindMesh Events now includes a comprehensive set of utilities and admin features for professional event management. This guide covers all new features, utilities, and integration points.

---

## Part 1: Utility Libraries

### 1.1 Event Templates (`lib/eventTemplates.ts`)

**Purpose:** Pre-built event configurations to speed up event creation

**Exports:**
- `EVENT_TEMPLATES: EventTemplate[]` - Array of 5 templates
- Each template includes default values for title, description, capacity, pricing, location

**Template Types:**
- Club Meetup - 250 cap, free, Pune, networking focused
- Workshop - 100 cap, $49/$39, hands-on training
- Conference - 500 cap, $999/$799, large-scale event
- Hackathon - 200 cap, free, competition
- Masterclass - 30 cap, $1499/$999, premium education

**Usage:**
```tsx
import { EVENT_TEMPLATES } from "@/lib/eventTemplates";

// Get all templates
const allTemplates = EVENT_TEMPLATES;

// Find specific template
const workshop = EVENT_TEMPLATES.find(t => t.id === 'workshop');

// Apply template to form
const { defaultEvent, description } = workshop!;
setFormData(prev => ({
  ...prev,
  ...defaultEvent
}));
```

---

### 1.2 QR Code Generation (`lib/eventQRCode.ts`)

**Purpose:** Generate QR codes for event check-ins and sharing

**Functions:**

#### `generateEventQRCodeUrl(eventId: string, title: string): string`
Generates check-in QR code URL
```tsx
const qrUrl = generateEventQRCodeUrl('event123', 'Web Summit 2024');
// Returns: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=event123%3AWeb+Summit+2024
```

#### `generateEventShareQRCodeUrl(eventId: string): string`
Generates shareable QR code URL (links to registration page)
```tsx
const shareQr = generateEventShareQRCodeUrl('event123');
// Returns QR code pointing to /events/event123
```

**Features:**
- Uses free qr-server.com API (no authentication)
- Returns 300x300 PNG images
- Can be used directly in `<img>` tags
- Supports URL encoding for special characters

**Usage in Admin Panel:**
```tsx
// In analytics modal
<img src={generateEventQRCodeUrl(eventId, title)} alt="Check-in QR" />

// Download functionality
const link = document.createElement('a');
link.href = generateEventQRCodeUrl(eventId, title);
link.download = `${title}-qr.png`;
link.click();
```

---

### 1.3 Event Analytics (`lib/eventAnalytics.ts`)

**Purpose:** Calculate metrics, forecasts, and trends for events

**Key Exports:**

#### Types
```tsx
interface EventMetrics {
  totalRegistered: number;
  capacity: number;
  registrationPercentage: number;
  spotsRemaining: number;
  isFull: boolean;
  isNearFull: boolean;
  capacityAlertLevel: 'optimal' | 'good' | 'warning' | 'critical';
}

interface RegistrationTrend {
  date: string;
  count: number;
}
```

#### Functions

**`calculateEventMetrics(event: Event): EventMetrics`**
```tsx
const metrics = calculateEventMetrics(event);
console.log(metrics);
// {
//   totalRegistered: 45,
//   capacity: 100,
//   registrationPercentage: 45,
//   spotsRemaining: 55,
//   isFull: false,
//   isNearFull: false,
//   capacityAlertLevel: 'optimal'
// }
```

**`getCapacityAlertMessage(metrics: EventMetrics): string | null`**
```tsx
const alert = getCapacityAlertMessage(metrics);
// Returns: "Event is 45% full - Great pace!" or null if optimal
```

**`getCapacityAlertColor(alertLevel: string): string`**
Maps alert level to HeroUI color:
- 'optimal' → 'success'
- 'good' → 'primary'
- 'warning' → 'warning'
- 'critical' → 'danger'

**`estimateFutureRegistrations(currentCount: number, daysUntilEvent: number): number`**
Linear extrapolation forecast
```tsx
const estimate = estimateFutureRegistrations(45, 7);
// Projects registrations 7 days from now based on growth rate
```

**`calculateGrowthRate(registrations: number): number`**
Registrations per day
```tsx
const rate = calculateGrowthRate(45);
// Returns average registrations per day
```

**`getRegistrationTrend(registrations: number): RegistrationTrend[]`**
Groups registrations by date for charting
```tsx
const trend = getRegistrationTrend(45);
// Returns: [{ date: '2024-01-15', count: 5 }, ...]
```

---

### 1.4 Event Export (`lib/eventExport.ts`)

**Purpose:** Export event data to CSV and downloadable formats

**Functions:**

#### `generateEventStatsCSV(event: Event, metrics: EventMetrics, registrations: Registration[]): string`
Generates full CSV content with event stats and registrations

**CSV Columns:**
- Event Information (title, date, location, category)
- Registrations Stats (total, capacity, percentage, spots remaining)
- Pricing Data (regular price, discount price, projected revenue)
- Registrations Table (attendee details)

**Usage:**
```tsx
const csv = generateEventStatsCSV(event, metrics, registrations);
// Returns CSV as string - can be saved or sent
```

#### `downloadEventStatsCSV(event: Event, metrics: EventMetrics, registrations: Registration[]): void`
Triggers browser download of CSV file

```tsx
downloadEventStatsCSV(event, metrics, registrations);
// File: EventTitle-stats-2024-01-15.csv
```

#### `generateRegistrationList(registrations: Registration[]): string`
Generates plain text registration list

```tsx
const list = generateRegistrationList(registrations);
// Returns formatted list for email/print
```

#### `downloadRegistrationList(registrations: Registration[], event: Event): void`
Downloads registration list as text file

```tsx
downloadRegistrationList(registrations, event);
// File: EventTitle-registrations-2024-01-15.txt
```

#### `generateStatsShareText(event: Event, metrics: EventMetrics): string`
Generates shareable text for social media

```tsx
const shareText = generateStatsShareText(event, metrics);
// "Great news! 45 people registered for Web Summit 2024!"
```

---

### 1.5 Social Sharing (`lib/eventSocialSharing.ts`)

**Purpose:** Share events on social media and via email

**Functions:**

#### Social Media Sharing

**`shareToLinkedIn(event: Event): void`**
Opens LinkedIn share dialog

**`shareToTwitter(event: Event): void`**
Opens Twitter/X share dialog

**`shareToInstagram(event: Event): void`**
Copies shareable text to clipboard (Instagram requires manual paste)

**`shareViaWhatsApp(event: Event): void`**
Opens WhatsApp share

**`shareViaTelegram(event: Event): void`**
Opens Telegram share

#### Email Sharing

**`shareViaEmail(event: Event): void`**
Opens default email client with event details in body

#### Utilities

**`getEventShareUrl(eventId: string, baseUrl?: string): string`**
```tsx
const url = getEventShareUrl('event123');
// Returns: https://yourdomain.com/events/event123
```

**`copyEventLinkToClipboard(event: Event): Promise<boolean>`**
```tsx
const copied = await copyEventLinkToClipboard(event);
if (copied) alert('Link copied!');
```

**`getEventSocialShareLinks(event: Event): Record<string, any>`**
Returns all social platform URLs
```tsx
const links = getEventSocialShareLinks(event);
// {
//   linkedin: { label: 'LinkedIn', url: '...', icon: 'linkedin' },
//   twitter: { label: 'Twitter/X', url: '...', icon: 'twitter' },
//   ...
// }
```

**`trackSocialShare(eventId: string, platform: string): void`**
Logs social shares (for analytics)

---

### 1.6 Event Feedback (`lib/eventFeedback.ts`)

**Purpose:** Collect post-event feedback and surveys

**Pre-built Surveys:**
- `DEFAULT_FEEDBACK_QUESTIONS` - 8 comprehensive questions
- `QUICK_FEEDBACK_QUESTIONS` - 3 quick questions
- `ADVANCED_FEEDBACK_QUESTIONS` - 10+ detailed questions

**Functions:**

#### `generateFeedbackFormUrl(eventId: string, attendeeEmail: string): string`
```tsx
const url = generateFeedbackFormUrl('event123', 'user@example.com');
// Returns URL to feedback form with pre-filled fields
```

#### `generateFeedbackEmailContent(eventTitle: string, attendeeName: string, feedbackUrl: string)`
```tsx
const { subject, html, text } = generateFeedbackEmailContent(
  'Web Summit 2024',
  'John',
  'https://...'
);
// HTML + text email templates ready to send
```

#### `calculateFeedbackStats(feedbacks: EventFeedback[])`
```tsx
const stats = calculateFeedbackStats(feedbacks);
// {
//   totalResponses: 45,
//   averageRating: 4.5,
//   satisfactionScore: 89,
//   sentiment: 'positive',
//   ratingDistribution: { 5: 30, 4: 10, 3: 4, 2: 1, 1: 0 }
// }
```

#### `generateFeedbackReport(eventTitle: string, feedbacks: EventFeedback[]): string`
```tsx
const report = generateFeedbackReport('Web Summit', feedbacks);
// Returns formatted text report with insights
```

#### `downloadFeedbackCSV(eventTitle: string, feedbacks: EventFeedback[]): void`
Downloads feedback as CSV file

---

## Part 2: Admin Panel Integration

### 2.1 Template Selector

**Location:** Add Event Modal → Top Section

**Features:**
- Browse 5 pre-built templates
- Click to apply template
- Auto-fill form with template defaults
- Override any fields as needed

**Implementation:**
```tsx
{!editingEvent && !showTemplateSelector && (
  <Button onPress={() => setShowTemplateSelector(true)}>
    Browse Templates
  </Button>
)}

{showTemplateSelector && (
  <div>
    {EVENT_TEMPLATES.map(template => (
      <Button
        key={template.id}
        onPress={() => handleApplyTemplate(template.id)}
      >
        {template.name}
      </Button>
    ))}
  </div>
)}
```

---

### 2.2 QR Code Modal

**Location:** Event Table → QR Icon

**Features:**
- View check-in QR code
- View shareable QR code
- Download individual QR codes
- Print-ready resolution

**Implementation:**
```tsx
<Modal isOpen={isQROpen} onClose={onQRClose}>
  <ModalBody>
    <img src={generateEventQRCodeUrl(selectedEventForQR.$id!, title)} />
    <Button onPress={downloadQR}>Download Check-in QR</Button>
    
    <img src={generateEventShareQRCodeUrl(selectedEventForQR.$id!)} />
    <Button onPress={downloadShareQR}>Download Share QR</Button>
  </ModalBody>
</Modal>
```

---

### 2.3 Analytics Modal

**Location:** Event Table → Analytics Icon

**Displays:**
- Registered count
- Capacity metrics
- Percentage full
- Spots remaining
- Status (Open/Filling/Full)
- 7-day forecast
- Capacity alerts
- Export buttons

**Implementation:**
```tsx
<Modal isOpen={isAnalyticsOpen} onClose={onAnalyticsClose}>
  <ModalBody>
    {(() => {
      const metrics = calculateEventMetrics(selectedEventForAnalytics);
      const forecast = estimateFutureRegistrations(
        selectedEventForAnalytics.registered,
        7
      );
      const alert = getCapacityAlertMessage(metrics);
      
      return (
        <>
          {alert && <Alert>{alert}</Alert>}
          <StatsGrid metrics={metrics} />
          <ForecastCard estimate={forecast} />
          <ExportButtons event={selectedEventForAnalytics} />
        </>
      );
    })()}
  </ModalBody>
</Modal>
```

---

### 2.4 Recurring Events

**Location:** Add Event Modal → Organizer & Recurring Tab

**Features:**
- Toggle to enable recurring
- Select pattern (weekly, bi-weekly, monthly, quarterly)
- System auto-creates series

**Implementation:**
```tsx
<Switch
  isSelected={formData.isRecurring}
  onValueChange={(checked) => handleInputChange('isRecurring', checked)}
>
  Enable recurring
</Switch>

{formData.isRecurring && (
  <Select
    value={formData.recurringPattern}
    onChange={(e) => handleInputChange('recurringPattern', e.target.value)}
  >
    <SelectItem key="weekly">Every Week</SelectItem>
    <SelectItem key="biweekly">Every 2 Weeks</SelectItem>
    <SelectItem key="monthly">Every Month</SelectItem>
    <SelectItem key="quarterly">Every Quarter</SelectItem>
  </Select>
)}
```

---

## Part 3: Using Utilities in Event Pages

### 3.1 Event Detail Page (`app/events/[id]/page.tsx`)

**Add social sharing buttons:**
```tsx
import { getEventSocialShareLinks, trackSocialShare } from "@/lib/eventSocialSharing";

const shareLinks = getEventSocialShareLinks(event);

{Object.entries(shareLinks).map(([platform, link]) => (
  <Button
    key={platform}
    as="a"
    href={link.url}
    target="_blank"
    onPress={() => trackSocialShare(event.$id!, platform)}
  >
    Share on {link.label}
  </Button>
))}
```

**Add QR code:**
```tsx
import { generateEventShareQRCodeUrl } from "@/lib/eventQRCode";

<img
  src={generateEventShareQRCodeUrl(event.$id!)}
  alt="Event QR Code"
  width={200}
  height={200}
/>
```

---

### 3.2 Registrations Page

**Send feedback surveys:**
```tsx
import { generateFeedbackEmailContent, generateFeedbackFormUrl } from "@/lib/eventFeedback";

async function sendFeedbackEmails(registrations: Registration[]) {
  for (const registration of registrations) {
    const feedbackUrl = generateFeedbackFormUrl(event.$id!, registration.email);
    const { subject, html } = generateFeedbackEmailContent(
      event.title,
      registration.name,
      feedbackUrl
    );
    
    // Send email via your email service
    await sendEmail({
      to: registration.email,
      subject,
      html
    });
  }
}
```

---

## Part 4: Data Models

### Event Interface (Extended)

```tsx
interface Event {
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;

  // Basic Info
  title: string;
  description: string;
  image: string;
  category: string;

  // Date & Time
  date: string;
  time: string;

  // Location
  venue: string;
  location: string;

  // Capacity & Registration
  capacity: number;
  registered: number;

  // Pricing
  price: number;
  discountPrice: number | null;

  // Organizer
  organizerName: string;
  organizerAvatar: string;

  // Metadata
  tags: string[];
  isFeatured: boolean;
  isPremium: boolean;
  status: 'upcoming' | 'ongoing' | 'past';

  // Recurring (NEW)
  isRecurring?: boolean;
  recurringPattern?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
  parentEventId?: string;
}
```

### EventMetrics (from Analytics)

```tsx
interface EventMetrics {
  totalRegistered: number;
  capacity: number;
  registrationPercentage: number;
  spotsRemaining: number;
  isFull: boolean;
  isNearFull: boolean;
  capacityAlertLevel: 'optimal' | 'good' | 'warning' | 'critical';
}
```

### EventFeedback (from Feedback)

```tsx
interface EventFeedback {
  eventId: string;
  attendeeEmail: string;
  attendeeName?: string;
  submittedAt: string;
  answers: { [questionId: string]: string | number };
  overallRating: number;
  comments?: string;
}
```

---

## Part 5: Database Considerations

### Appwrite Collections

**Events Collection:**
- Supports all new fields
- Existing events unaffected
- Recurring pattern stored as string

**New Optional Fields:**
```
- isRecurring (boolean, default: false)
- recurringPattern (string, optional)
- parentEventId (string, optional)
```

### No Migration Required
- All new fields are optional
- Backward compatible with existing events
- Can enable recurring on any event at any time

---

## Part 6: Best Practices

### 1. Template Usage
- Let users customize after template selection
- Don't force template defaults
- Show template preview before applying

### 2. QR Code Management
- Generate QR codes on-demand (not stored)
- Download for offline use
- Display in event marketing materials

### 3. Analytics Interpretation
- Monitor capacity alerts
- Track growth trends
- Forecast for planning

### 4. Social Sharing
- Enable on event detail pages
- Track which channels drive registrations
- Use for marketing attribution

### 5. Feedback Collection
- Send within 24 hours of event
- Make surveys optional (not mandatory)
- Act on feedback for improvements

### 6. Recurring Events
- Use for regular meetups and training
- Create templates for recurring series
- Track series performance aggregate

---

## Part 7: Future Enhancements

### Phase 2 Features
- [ ] Chart visualizations for analytics
- [ ] Email reminder automation
- [ ] Advanced attendee segmentation
- [ ] ROI and revenue tracking
- [ ] Calendar integration
- [ ] Webhook notifications
- [ ] API access for integrations

### Phase 3 Features
- [ ] Multi-day events with sessions
- [ ] Sponsorship tracking
- [ ] Badge/certificate generation
- [ ] Attendance tracking
- [ ] Post-event metrics dashboard

---

## Support & Documentation

For questions:
1. Review utility JSDoc comments in each file
2. Check admin panel implementations
3. Test features in development first
4. Refer to this integration guide

All utilities are self-contained and can be used independently.
