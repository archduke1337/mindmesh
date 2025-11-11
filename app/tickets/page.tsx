// app/tickets/page.tsx
import { Suspense } from "react";
import TicketsPageContent from "./TicketsPageContent";

// Loading fallback component
function TicketsLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
        <p className="mt-4 text-default-500">Loading tickets...</p>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<TicketsLoading />}>
      <TicketsPageContent />
    </Suspense>
  );
}
