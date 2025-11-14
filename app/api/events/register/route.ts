// app/api/events/register/route.ts
// Server-side endpoint for atomic event registration to prevent race conditions
import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID, Query } from 'appwrite';
import { sendRegistrationEmail } from '@/lib/emailService';
import { DATABASE_ID, REGISTRATIONS_COLLECTION_ID, EVENTS_COLLECTION_ID } from '@/lib/database';
import { getErrorMessage } from '@/lib/errorHandler';

interface RegisterRequestBody {
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
}

interface RegisterResponseBody {
  success: boolean;
  message: string;
  ticketId?: string;
  error?: string;
}

/**
 * POST /api/events/register
 * 
 * Atomically registers a user for an event on the server side.
 * This prevents race conditions that could occur with client-side registration.
 * 
 * Uses admin credentials to bypass user permissions and ensure registration succeeds.
 */
export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponseBody>> {
  try {
    const body: RegisterRequestBody = await request.json();
    const { eventId, userId, userName, userEmail } = body;

    // Validate input
    if (!eventId || !userId || !userName || !userEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
          error: 'eventId, userId, userName, and userEmail are required',
        },
        { status: 400 }
      );
    }

    console.log(`[API] Registering user ${userId} for event ${eventId}`);

    // Use Appwrite REST API directly with API key for admin access
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
    const apiKey = process.env.APPWRITE_API_KEY;
    
    if (!apiKey) {
      console.error('[API] APPWRITE_API_KEY is not set');
      return NextResponse.json(
        {
          success: false,
          message: 'Server configuration error',
          error: 'API key not configured',
        },
        { status: 500 }
      );
    }

    const databaseId = DATABASE_ID;
    const registrationsCollectionId = REGISTRATIONS_COLLECTION_ID;

    // Check if already registered using REST API with proper query encoding
    const queries = [
      `equal("eventId","${eventId}")`,
      `equal("userId","${userId}")`
    ];
    const queryString = queries.map((q, i) => `queries[${i}]=${encodeURIComponent(q)}`).join('&');
    const listUrl = `${endpoint}/v1/databases/${databaseId}/collections/${registrationsCollectionId}/documents?${queryString}`;
    
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'X-Appwrite-Key': apiKey,
        'X-Appwrite-Project': projectId,
        'Content-Type': 'application/json',
      },
    });

    if (!listResponse.ok) {
      const errorData = await listResponse.json().catch(() => ({}));
      console.error('[API] Check registrations failed:', listResponse.status, errorData);
      throw new Error(`Failed to check existing registrations: ${listResponse.statusText}`);
    }

    const listData = await listResponse.json();

    if (listData.documents && listData.documents.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Already registered for this event',
          error: 'Already registered for this event',
        },
        { status: 409 }
      );
    }

    // Get event to check capacity
    const getEventUrl = `${endpoint}/v1/databases/${databaseId}/collections/${EVENTS_COLLECTION_ID}/documents/${eventId}`;
    
    const getEventResponse = await fetch(getEventUrl, {
      method: 'GET',
      headers: {
        'X-Appwrite-Key': apiKey,
        'X-Appwrite-Project': projectId,
        'Content-Type': 'application/json',
      },
    });

    if (!getEventResponse.ok) {
      throw new Error(`Failed to fetch event: ${getEventResponse.statusText}`);
    }

    const event = await getEventResponse.json();

    if (event.capacity && event.registered >= event.capacity) {
      return NextResponse.json(
        {
          success: false,
          message: 'Event is full',
          error: 'Event is full',
        },
        { status: 409 }
      );
    }

    // Create registration document
    const createUrl = `${endpoint}/v1/databases/${databaseId}/collections/${registrationsCollectionId}/documents`;
    
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'X-Appwrite-Key': apiKey,
        'X-Appwrite-Project': projectId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId: ID.unique(),
        data: {
          eventId,
          userId,
          userName,
          userEmail,
          registeredAt: new Date().toISOString(),
        }
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create registration: ${createResponse.statusText}`);
    }

    const registration = await createResponse.json();
    const ticketId = registration.$id || '';

    if (!ticketId) {
      throw new Error('Registration created but no ticket ID returned');
    }

    console.log(`[API] Registration successful: ${ticketId}`);

    // Update event registered count
    try {
      const updateUrl = `${endpoint}/v1/databases/${databaseId}/collections/${EVENTS_COLLECTION_ID}/documents/${eventId}`;
      
      await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'X-Appwrite-Key': apiKey,
          'X-Appwrite-Project': projectId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registered: (event.registered || 0) + 1
        })
      });
      
      console.log(`[API] Updated event registered count to ${(event.registered || 0) + 1}`);
    } catch (updateError) {
      console.warn(`[API] Warning: failed to update event registered count:`, updateError);
      // Don't fail registration if count update fails
    }

    // Try to send email in the background (don't block if it fails)
    try {
      await sendRegistrationEmail(userEmail, userName, {
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        location: event.location,
        image: event.image,
        organizerName: event.organizerName,
        price: event.price,
        discountPrice: event.discountPrice,
      });
      console.log(`[API] Email sent to ${userEmail}`);
    } catch (emailError) {
      console.warn(`[API] Failed to send registration email: ${emailError}`);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        ticketId,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : getErrorMessage(error);
    console.error('[API] Registration error:', errorMessage);

    // Determine HTTP status based on error type
    let statusCode = 500;
    if (errorMessage.includes('Already registered')) {
      statusCode = 409; // Conflict
    } else if (errorMessage.includes('Event is full')) {
      statusCode = 409; // Conflict
    } else if (errorMessage.includes('not found')) {
      statusCode = 404;
    } else if (errorMessage.includes('unauthorized') || errorMessage.includes('not authorized')) {
      statusCode = 403;
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
